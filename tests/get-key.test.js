const getKey = require("../get-key");

const createStory = fileName => ({ parameters: { fileName } });
describe("getKey", () => {
  describe("when the story file is named", () => {
    it("returns file name", () => {
      expect(getKey(createStory("/Baz/Foo/bar/MyStory.stories.js"))).toBe(
        "mystory"
      );
    });
  });

  describe("when the story file is named in an unknown way", () => {
    it("returns parent directory name", () => {
      expect(
        getKey(createStory("/Baz/Foo/MyPackage/MyStory.stories.es.js"))
      ).toBe("mypackage");
    });
  });

  describe("when the story file is not named", () => {
    it("returns parent directory name", () => {
      expect(getKey(createStory("/Baz/Foo/MyPackage/index.stories.js"))).toBe(
        "mypackage"
      );
    });
  });

  describe("when the story file is not named and in stories directory", () => {
    it("returns stories parent directory name", () => {
      expect(getKey(createStory("/Baz/Foo/stories/index.stories.js"))).toBe(
        "foo"
      );
    });
  });

  describe("when the story file in an unknown location", () => {
    it("returns null", () => {
      expect(getKey(createStory("/stories/index.stories.js"))).toBe(null);
    });
  });
});
