export default function isFullMenuAvailable(
  editorKind: string | undefined | null
) {
  switch (editorKind) {
    case "FILL_IN_GAPS":
      return false;
    case "SPOT_BUG":
      return false;
    case "SORT_BLOCKS":
      return false;
    default:
      return true;
  }
}
