# Storybook Addon Redirect

Storybook Addon Redirect allows you to create redirects to your stories in
[Storybook](https://storybook.js.org).

## Getting Started

```sh
npm install storybook-redirect --save-dev
```

If you don't already have one, create a file called `addons.js` in your
Storybook directory.

Add the following to `addons.js` to register the addon with storybook

```js
import 'storybook-redirect/register';
```

An ID for each story file is generated based on the file path. This ID is used
to redirect to the story group, using the URL parameter `package`.

 - For a named story file, the story group can be accessed via the file name
   - e.g. The stories at `MyStory.stories.js` via `?package=mystory`
 - For an index file with a named directory, the story group can be accessed via
 the directory name
   - e.g. The stories at `MyComponent/index.stories.js` via
   `?package=mycomponent`
- For an index file under a `stories` directory, the story group can be accessed
via the top package directory name
   - e.g. The stories at `MyPackage/stories/index.stories.js` via
   `?package=mypackage`

Linking to a specific story within a story group is not supported by default.
However, this could be added by passing in a custom `getKey` function to the
addon - please See the **Customisation** section below.

## Customisation

To customise the addon, you can import the addon function directly (without the
`/register`) and call it with a `getKey` function and an `options` object. To
use the existing `getKey` function, you can import it using the named import.

```js
import storybookRedirect, { getKey } from 'storybook-redirect';

const options = {};
storybookRedirect(getKey, options);
```

### `getKey`

This function is called with a story object and should return a string key which
will be matched against the URL parameter. Returning `undefined` means the story
will not be added. Keys can only be used once - returning the same key again
will not overwrite the previously set story.

Example story object:
```js
{
  id: "test-stories--test-story",
  kind: "Test Stories",
  name: "Test Story",
  story: "Test Story",
  parameters: {
    fileName: "./packages/test-story/stories/index.stories.js",
    options: {
      hierarchyRootSeparator: "|",
      hierarchySeparator: {}
    }
  }
}
```

An example `getKey` which links to a specific story within a story group could
be implemented as below. This uses the default `getKey` function to generate
an ID from the file name, but then extends this to link to the specific story
using the suffix of the story ID.

```js
import storybookRedirect, { getKey } from "storybook-redirect";

storybookRedirect(function(story) {
  const fileNameId = getKey(story);
  return `${fileNameId}--${story.id.split("--")[1]}`;
});

// eg. ?package=mypackage--story-name
```

### `options`

This object can be used to configure the URL `parameter` name and to turn on
`debug` output.

#### `parameter`

Configuring the `parameter` will change the URL parameter used when matching.
Make sure not to conflict with existing storybook URL parameters, e.g. `path`

```js
{
  parameter: "custom-parameter-name"
}
```

Redirect URLs will now need to be set up as `?custom-parameter-name=mypackage`


#### `debug`

Setting this to `true` will output debug details in the browsers developer
console. The mapping object used to map IDs to stories is also output as part of
the output.

```js
{
  debug: true
}
```

You can enable this, without any other changes, by passing in the default
`getKey` and an options object containing only `debug`

```js
import storybookRedirect, { getKey } from "storybook-redirect";

storybookRedirect(getKey, { debug: true });
```
