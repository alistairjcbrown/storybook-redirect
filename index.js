const { addons } = require("@storybook/addons");
const { SET_STORIES, STORY_MISSING } = require("@storybook/core-events");
const getKeyDefault = require("./get-key");

const ADDON_ID = "storybook-redirect";

function storybookRedirect(getKey = getKeyDefault, customOptions = {}) {
  const options = {
    parameter: "package",
    debug: false,
    ...customOptions
  };

  const debug = (message, ...args) => {
    if (options.debug) console.log(ADDON_ID, `-- ${message}`, ...args);
  };

  addons.register(ADDON_ID, api => {
    debug("registered", options);
    const channel = api.getChannel();
    let storyMapping = {};

    channel.on(SET_STORIES, ({ stories }) => {
      const values = Object.keys(stories).map(id => stories[id]);
      storyMapping = values.reduce((mapping, story) => {
        const key = getKey(story);
        if (!key || mapping[key]) return mapping;
        return { ...mapping, [key]: story };
      }, {});

      debug("mapping", storyMapping);
    });

    channel.on(STORY_MISSING, () => {
      const { queryParams } = api.getUrlState();
      if (!queryParams[options.parameter]) return;
      const story = storyMapping[queryParams[options.parameter]];
      if (!story) return;
      debug("story matched", story);
      api.selectStory(story.kind, story.name);
    });
  });
}

storybookRedirect.getKey = getKeyDefault;
module.exports = storybookRedirect;
