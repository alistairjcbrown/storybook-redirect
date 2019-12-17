function getKeyDefault({ parameters: { fileName } }) {
  const pathPieces = fileName.split("/");
  const pathPieceCount = pathPieces.length;
  const filename = pathPieces[pathPieceCount - 1];
  const storyDirectory = pathPieces[pathPieceCount - 2];
  const packageDirectory = pathPieces[pathPieceCount - 3];
  const filenameKey = filename.replace(".stories.js", "").replace(".js", "");
  if (filenameKey !== "index" && filenameKey.indexOf(".") === -1) {
    return filenameKey.toLowerCase();
  }
  if (storyDirectory !== "stories") return storyDirectory.toLowerCase();
  if (packageDirectory) return packageDirectory.toLowerCase();
  return null;
}

export default getKeyDefault;
