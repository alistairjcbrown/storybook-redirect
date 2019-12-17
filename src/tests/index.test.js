import { addons } from "@storybook/addons";
import { SET_STORIES, STORY_MISSING } from "@storybook/core-events";
import storybookRedirect from "../";

const stories = {
  "test-stories--test-story-1": {
    id: "test-stories--test-story-1",
    kind: "Test Stories",
    name: "Test Story 1",
    story: "Test Story 1",
    parameters: {
      fileName: "./packages/test-story/stories/index.stories.js",
      options: {
        hierarchyRootSeparator: "|",
        hierarchySeparator: {}
      }
    }
  },
  "test-stories--test-story-2": {
    id: "test-stories--test-story-2",
    kind: "Test Stories",
    name: "Test Story 2",
    story: "Test Story 2",
    parameters: {
      fileName: "./packages/test-story/stories/index.stories.js",
      options: {
        hierarchyRootSeparator: "|",
        hierarchySeparator: {}
      }
    }
  },
  "test-stories--test-story-3": {
    id: "test-stories--test-story-3",
    kind: "Test Stories",
    name: "Test Story 3",
    story: "Test Story 3",
    parameters: {
      fileName: "./packages/test-story/stories/index.stories.js",
      options: {
        hierarchyRootSeparator: "|",
        hierarchySeparator: {}
      }
    }
  }
};

const mockChannel = {
  on: jest.fn().mockImplementation((event, callback) => {
    if (event === SET_STORIES) {
      callback({ stories });
    } else if (event === STORY_MISSING) {
      callback();
    } else {
      throw new Error("unsupported event", event);
    }
  })
};

const mockApi = {
  getChannel: jest.fn().mockReturnValue(mockChannel),
  getUrlState: jest.fn(),
  selectStory: jest.fn()
};

jest.mock("@storybook/addons", () => ({
  addons: { register: jest.fn() }
}));

describe("storybook-redirect", () => {
  let addon;

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  describe("when add-on is called with default settings", () => {
    beforeEach(() => {
      storybookRedirect();
      addon = addons.register.mock.calls[0][1];
    });

    it("registers as an add-on", () => {
      expect(addons.register).toBeCalledTimes(1);
      expect(addons.register).toBeCalledWith(
        "storybook-redirect",
        expect.any(Function)
      );
    });

    it("does not output debug logs", () => {
      expect(console.log).not.toBeCalled();
    });

    describe("when parameter is available and matches", () => {
      beforeEach(() => {
        mockApi.getUrlState.mockReturnValue({
          queryParams: { package: "test-story" }
        });
        addon(mockApi);
      });

      it("redirects to the matching story", () => {
        expect(mockApi.selectStory).toBeCalledTimes(1);
        expect(mockApi.selectStory).toBeCalledWith(
          "Test Stories",
          "Test Story 1"
        );
      });
    });

    describe("when parameter is available but does not match", () => {
      beforeEach(() => {
        mockApi.getUrlState.mockReturnValue({
          queryParams: { package: "foo" }
        });
        addon(mockApi);
      });

      it("does not redirect", () => {
        expect(mockApi.selectStory).not.toBeCalled();
      });
    });

    describe("when parameter is not available", () => {
      beforeEach(() => {
        mockApi.getUrlState.mockReturnValue({
          queryParams: {
            test: "test-story"
          }
        });
        addon(mockApi);
      });

      it("does not redirect", () => {
        expect(mockApi.selectStory).not.toBeCalled();
      });
    });
  });

  describe("when add-on is called with custom settings", () => {
    beforeEach(() => {
      const mockGetKey = jest
        .fn()
        .mockReturnValueOnce("foo")
        .mockReturnValueOnce("bar");
      const mockOptions = { parameter: "test" };
      storybookRedirect(mockGetKey, mockOptions);
      addon = addons.register.mock.calls[0][1];
    });

    describe("when parameter is available and matches", () => {
      beforeEach(() => {
        mockApi.getUrlState.mockReturnValue({
          queryParams: { test: "bar" }
        });
        addon(mockApi);
      });

      it("redirects to the matching story", () => {
        expect(mockApi.selectStory).toBeCalledTimes(1);
        expect(mockApi.selectStory).toBeCalledWith(
          "Test Stories",
          "Test Story 2"
        );
      });
    });

    describe("when parameter is available but does not match", () => {
      beforeEach(() => {
        mockApi.getUrlState.mockReturnValue({
          queryParams: { test: "baz" }
        });
        addon(mockApi);
      });

      it("does not redirect", () => {
        expect(mockApi.selectStory).not.toBeCalled();
      });
    });

    describe("when parameter is not available", () => {
      beforeEach(() => {
        mockApi.getUrlState.mockReturnValue({
          queryParams: { package: "bar" }
        });
        addon(mockApi);
      });

      it("does not redirect", () => {
        expect(mockApi.selectStory).not.toBeCalled();
      });
    });
  });

  describe("when add-on is called with debug enabled", () => {
    beforeEach(() => {
      const mockOptions = { debug: true };
      storybookRedirect(storybookRedirect.getKey, mockOptions);
      mockApi.getUrlState.mockReturnValue({
        queryParams: { package: "test-story" }
      });
      addon = addons.register.mock.calls[0][1];
      addon(mockApi);
    });

    it("does outputs debug logs", () => {
      expect(console.log).toBeCalledTimes(3);
      expect(console.log).toBeCalledWith(
        "storybook-redirect",
        "-- registered",
        { debug: true, parameter: "package" }
      );
      expect(console.log).toBeCalledWith("storybook-redirect", "-- mapping", {
        "test-story": stories["test-stories--test-story-1"]
      });
      expect(console.log).toBeCalledWith(
        "storybook-redirect",
        "-- story matched",
        stories["test-stories--test-story-1"]
      );
    });
  });
});
