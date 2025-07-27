import { observer } from 'mobx-react';
import { type Key, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useShortcut } from '@/hooks/useShortcut';
import { createContext } from '@/lib/create-context';
import { useSetFocusElement } from '@/lib/focus-manager';
import { slugify } from '@/lib/utils';
import { TaskModel } from '@/models/task.model';
import type {
  AbstractView,
  ViewItem as ViewItemType,
} from '@/view/abstract.view';

const UP_KEYS = ['ArrowUp', 'ArrowLeft', 'k', 'K'] satisfies Key[];
const DOWN_KEYS = ['ArrowDown', 'ArrowRight', 'j', 'J'] satisfies Key[];
const ESCAPE_KEYS = ['Escape'] satisfies Key[];

const ViewContext = createContext<{
  viewModel: AbstractView<any>;
  navigation: {
    mode: 'keyboard' | 'mouse' | 'focus';
    setMode: (mode: 'keyboard' | 'mouse' | 'focus') => void;
  };
}>('ViewContext');

export const ViewContextProvider = ViewContext[0];

export const useViewContext = ViewContext[1];

export const ViewRoot = observer(
  <R extends ViewItemType, T extends AbstractView<R>>({
    children,
    viewModel,
  }: {
    children: React.ReactNode;
    viewModel: T;
  }) => {
    const bodyRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    useSetFocusElement(bodyRef.current);

    const [navigationMode, setNavigationMode] = useState<
      'keyboard' | 'mouse' | 'focus'
    >('mouse');

    function searchHandler(e: KeyboardEvent) {
      viewModel.searchInputRef?.current?.focus();
      viewModel.setSelectedIndex(-1);
      e.preventDefault();
      e.stopPropagation();
    }

    useShortcut('Command+f', searchHandler);
    useShortcut('Control+f', searchHandler);
    useShortcut('/', searchHandler);

    useShortcut('Escape', resetFocus);

    viewModel.bodyRef = bodyRef;

    function resetFocus() {
      viewModel.setSelectedIndex(-1);

      if (viewModel.searchInputRef?.current) {
        viewModel.searchInputRef.current.blur();
      } else {
        console.warn('no search input ref in table view');
      }

      if (viewModel.bodyRef?.current) {
        viewModel.bodyRef.current.focus();
      } else {
        console.warn('no body ref in table view');
      }
    }

    function tryCheckItem(forceTrue?: boolean) {
      const item = viewModel.currentItem();
      if (item) {
        viewModel.checkItem(item, forceTrue);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      setNavigationMode('keyboard');

      if (ESCAPE_KEYS.includes(e.key)) {
        resetFocus();
      }

      if (UP_KEYS.includes(e.key)) {
        if (e.metaKey || e.ctrlKey) {
          return;
        }

        viewModel.goUp();

        if (e.shiftKey) {
          tryCheckItem();
        }

        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === 'x') {
        tryCheckItem();
      }

      if (e.key === 'd') {
        const item = viewModel.currentItem();

        if (item instanceof TaskModel) {
          switch (item.status) {
            case 'done':
              item.setStatus('todo');
              item.setCompleted();
              break;
            case 'in_progress':
              item.setStatus('done');
              break;
            case 'todo':
              item.setStatus('in_progress');
              break;
            default:
          }
        }
      }

      if (DOWN_KEYS.includes(e.key)) {
        if (e.metaKey || e.ctrlKey) {
          return;
        }

        viewModel.goDown();

        if (e.shiftKey) {
          tryCheckItem();
        }

        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === 'Enter') {
        const item = viewModel.currentItem();
        if (item) {
          navigate(`/${item.type}/${item.smallId}/${slugify(item.name)}`);
        }
      }
    }

    useEffect(() => {
      function handleMouseMove(e: MouseEvent) {
        setNavigationMode('mouse');
        viewModel.setLastHoveredElement(e.target as HTMLElement);
      }

      if (!bodyRef.current) {
        throw new Error('No body ref in table view');
      }

      bodyRef.current.focus();

      bodyRef.current.addEventListener('keydown', handleKeyDown, {
        capture: true,
      });

      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        if (!bodyRef.current) {
          return;
        }

        bodyRef.current.removeEventListener('keydown', handleKeyDown, {
          capture: true,
        });

        document.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);

    return (
      <div
        className="h-full w-full focus:outline-none"
        id="view-root"
        ref={bodyRef} // make the div focusable (to be able to use the keyboard)
        tabIndex={-1}
      >
        <ViewContextProvider
          navigation={{
            mode: navigationMode,
            setMode: setNavigationMode,
          }}
          viewModel={viewModel}
        >
          {children}
        </ViewContextProvider>
      </div>
    );
  }
);
