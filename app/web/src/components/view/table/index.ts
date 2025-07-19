import {
	ViewHeaderBody,
	ViewHeaderPossibilities,
	ViewHeaderSearch,
	ViewHeaderSpacer,
	ViewHeaderTitle,
} from "./header.table";
import {
	ViewItemsContextMenu,
	ViewItemsList,
	ViewItemsRoot,
} from "./items.table";
import {
	ViewItemAuthor,
	ViewItemCheckbox,
	ViewItemContextMenu,
	ViewItemDate,
	ViewItemIcon,
	ViewItemInfos,
	ViewItemLabels,
	ViewItemLine,
	ViewItemSmallId,
	ViewItemTags,
} from "./line.table";
import { ViewRoot } from "./root.table";

export const View = {
	Header: {
		Body: ViewHeaderBody,
		Title: ViewHeaderTitle,
		Spacer: ViewHeaderSpacer,
		Possibilities: ViewHeaderPossibilities,
		Search: ViewHeaderSearch,
	},
	Item: {
		Line: ViewItemLine,
		Infos: ViewItemInfos,
		Icon: ViewItemIcon,
		SmallId: ViewItemSmallId,
		Spacer: ViewHeaderSpacer,
		Labels: ViewItemLabels,
		Author: ViewItemAuthor,
		Date: ViewItemDate,
		ContextMenu: ViewItemContextMenu,
		Checkbox: ViewItemCheckbox,
		Tags: ViewItemTags,
	},
	Root: ViewRoot,
	Items: {
		Root: ViewItemsRoot,
		List: ViewItemsList,
		Menu: ViewItemsContextMenu,
	},
};
