To get tldraw data from storage without rendering the UI, you will follow the headless approach discussed previously, specifically focusing on loading your stored data into a `TLStore` or `Editor` instance.

The key steps are:

1.  **Retrieve your tldraw data** from wherever it's stored (e.g., LocalStorage, IndexedDB, a database, a file server). This data will typically be in the `TLStoreSnapshot` format or the `TldrawFile` format.
2.  **Initialize a `TLStore` (or `Editor`)** with this data.

Let's look at examples for common storage mechanisms:

### 1. From LocalStorage

If you've saved tldraw's state to LocalStorage (e.g., using `JSON.stringify(editor.store.getSnapshot())`), you can retrieve it:

```javascript
import { createTLStore, Editor, defaultShapes } from '@tldraw/tldraw';
import { TLStoreSnapshot, TldrawFile } from '@tldraw/tlschema';

/**
 * Initializes a tldraw editor instance in a headless mode,
 * optionally loading data from a TLStoreSnapshot or TldrawFile.
 */
function createHeadlessTldrawEditor(
  initialData?: TLStoreSnapshot | TldrawFile,
): Editor {
  const store = createTLStore({
    shapeUtils: defaultShapes,
  });

  if (initialData) {
    if ('tldrawFileFormatVersion' in initialData) {
      const snapshot: TLStoreSnapshot = {
        schema: initialData.file.schema,
        records: initialData.file.records,
      };
      store.loadSnapshot(snapshot);
    } else {
      store.loadSnapshot(initialData);
    }
  }

  const editor = new Editor({ store });
  return editor;
}

function loadTldrawFromLocalStorage() {
  try {
    const storedData = localStorage.getItem('my-tldraw-data');

    if (storedData) {
      const data: TLStoreSnapshot | TldrawFile = JSON.parse(storedData);

      console.log('Loading tldraw data from LocalStorage...');
      const headlessEditor = createHeadlessTldrawEditor(data);

      console.log('Successfully loaded data into headless editor.');
      console.log(
        'Number of records:',
        headlessEditor.store.allRecords().size,
      );

      // Now you can work with the editor instance programmatically
      const allShapes = Array.from(headlessEditor.store.allRecords()).filter(
        (r) => r.typeName === 'shape',
      );
      console.log('Shapes in loaded data:', allShapes.length);

      // Example: find a specific shape
      const mySpecificShape = headlessEditor.getShapeById('shape:my-box');
      if (mySpecificShape) {
        console.log('Found my-box shape:', mySpecificShape.props);
      }

      return headlessEditor;
    } else {
      console.log('No tldraw data found in LocalStorage.');
      return createHeadlessTldrawEditor(); // Return an empty editor if no data
    }
  } catch (error) {
    console.error('Failed to load tldraw data from LocalStorage:', error);
    return createHeadlessTldrawEditor(); // Return an empty editor on error
  }
}

// Usage:
const editorFromStorage = loadTldrawFromLocalStorage();

// You can now interact with editorFromStorage as a headless instance
editorFromStorage.createShapes([
  {
    id: 'new-shape-after-load',
    type: 'geo',
    x: 300,
    y: 300,
    props: { geo: 'rectangle', w: 50, h: 50, color: 'purple' },
  },
]);

console.log(
  'Total records after adding a new shape:',
  editorFromStorage.store.allRecords().size,
);
```

**To test this, you'd first need to save some data:**

```javascript
// Run this in a browser console where a Tldraw component is rendered
// Or integrate it into your app's save logic
import { Editor } from '@tldraw/tldraw';

let editorInstance: Editor | null = null; // Assuming you have access to the editor instance

// For demonstration, let's pretend we have an editor instance
// In a real app, you'd get this from useEditor or a ref.
// const editor = useEditor() // inside a React component
// For a quick test:
if (typeof window !== 'undefined') {
  // Only run in browser environment
  const testStore = createTLStore({ shapeUtils: defaultShapes });
  editorInstance = new Editor({ store: testStore });
  editorInstance.createShapes([
    {
      id: 'shape:my-box',
      type: 'geo',
      x: 10,
      y: 10,
      props: { w: 50, h: 50, geo: 'rectangle' },
    },
    {
      id: 'shape:my-frame',
      type: 'frame',
      x: 100,
      y: 100,
      props: { w: 200, h: 150, name: 'My Saved Frame' },
    },
  ]);
  localStorage.setItem('my-tldraw-data', JSON.stringify(editorInstance.store.getSnapshot()));
  console.log('Test data saved to LocalStorage.');
}
```

### 2. From a Server/File (e.g., `.tldr` file)

If your data is stored as a `.tldr` file (which is just a JSON file following the `TldrawFile` schema), you would fetch it and then load it. This example assumes a Node.js-like environment or an environment where `fetch` is available and can access local files or network resources.

```javascript
import { createTLStore, Editor, defaultShapes } from '@tldraw/tldraw';
import { TLStoreSnapshot, TldrawFile } from '@tldraw/tlschema';
import fs from 'node:fs/promises'; // For Node.js to read files

// (Re-use createHeadlessTldrawEditor from previous example)
function createHeadlessTldrawEditor(
  initialData?: TLStoreSnapshot | TldrawFile,
): Editor {
  const store = createTLStore({
    shapeUtils: defaultShapes,
  });

  if (initialData) {
    if ('tldrawFileFormatVersion' in initialData) {
      const snapshot: TLStoreSnapshot = {
        schema: initialData.file.schema,
        records: initialData.file.records,
      };
      store.loadSnapshot(snapshot);
    } else {
      store.loadSnapshot(initialData);
    }
  }

  const editor = new Editor({ store });
  return editor;
}

async function loadTldrawFromFile(filePath: string): Promise<Editor> {
  try {
    // In a browser, you'd use fetch or a file input.
    // In Node.js, you'd use fs.promises.readFile.
    const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
    const data: TldrawFile = JSON.parse(fileContent);

    if (!('tldrawFileFormatVersion' in data && 'file' in data)) {
      throw new Error('Invalid tldraw file format.');
    }

    console.log(`Loading tldraw data from ${filePath}...`);
    const headlessEditor = createHeadlessTldrawEditor(data);

    console.log(
      `Successfully loaded ${
        Object.keys(data.file.records).length
      } records into headless editor.`,
    );

    return headlessEditor;
  } catch (error) {
    console.error(`Failed to load tldraw data from ${filePath}:`, error);
    // You might want to throw the error or return an empty editor
    return createHeadlessTldrawEditor();
  }
}

// Usage example (assuming you have a 'my-drawing.tldr' file):
// To make a test file:
// 1. Go to tldraw.com
// 2. Draw some shapes, including a frame
// 3. File > Save As... and download the .tldr file
// 4. Place it in the same directory as your script or adjust the path.
(async () => {
  if (typeof process !== 'undefined' && process.versions != null && process.versions.node != null) {
    // Only run in Node.js environment
    // Create a dummy .tldr file for testing if it doesn't exist
    const dummyFilePath = './test-drawing.tldr';
    try {
      await fs.access(dummyFilePath);
      console.log(`${dummyFilePath} already exists.`);
    } catch (e) {
      console.log(`Creating dummy ${dummyFilePath}...`);
      const dummyContent: TldrawFile = {
        tldrawFileFormatVersion: 1,
        name: 'Test Drawing',
        file: {
          schema: {
            recordVersions: {
              asset: { record: 1, pointer: 1 },
              camera: { record: 1, pointer: 1 },
              document: { record: 1, pointer: 1 },
              instance: { record: 1, pointer: 1 },
              instance_page_state: { record: 1, pointer: 1 },
              page: { record: 1, pointer: 1 },
              shape: { record: 1, pointer: 1 },
            },
          },
          records: {
            'page:page-0': {
              id: 'page:page-0',
              name: 'Page 1',
              index: 'a1',
              typeName: 'page',
            },
            'shape:box-0': {
              id: 'shape:box-0',
              type: 'geo',
              parentId: 'page:page-0',
              x: 100,
              y: 100,
              props: { w: 100, h: 100, geo: 'rectangle', color: 'blue' },
              rotation: 0,
              isLocked: false,
              opacity: 1,
              meta: {},
              typeName: 'shape',
            },
            'shape:frame-0': {
              id: 'shape:frame-0',
              type: 'frame',
              parentId: 'page:page-0',
              x: 250,
              y: 250,
              props: { w: 200, h: 150, name: 'Frame from File' },
              rotation: 0,
              isLocked: false,
              opacity: 1,
              meta: {},
              typeName: 'shape',
            },
          },
        },
      };
      await fs.writeFile(dummyFilePath, JSON.stringify(dummyContent, null, 2));
      console.log('Dummy file created.');
    }

    const editorFromFile = await loadTldrawFromFile(dummyFilePath);
    const frames = Array.from(editorFromFile.store.allRecords()).filter(
      (r) => r.typeName === 'shape' && r.type === 'frame',
    );
    console.log('Frames loaded from file:', frames.length);
  } else {
    console.log('Skipping file loading example: Not in Node.js environment.');
  }
})();
```

**Key Takeaways:**

- **Data Format:** Understand whether your stored data is a raw `TLStoreSnapshot` (the direct output of `editor.store.getSnapshot()`) or a `TldrawFile` (the format used for `.tldr` exports, which wraps the snapshot). You'll need to parse them accordingly.
- **No UI Component:** The crucial part is that you do _not_ use the `<Tldraw />` React component or anything that attempts to render to a DOM element. You only interact with the `Editor` and `TLStore` classes directly.
- **Dependencies:** Ensure you have `@tldraw/tldraw` installed in your project. If you're working in Node.js, you'll also need Node's built-in `fs/promises` module for file operations.
