import {configure} from '@storybook/react'
import {setOptions} from '@storybook/addon-options'
import 'babel-polyfill'

setOptions({
  name: 'React Calendar',
  url: 'https://github.com',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: false,
  showSearchBox: false,
  downPanelInRight: false,
  sortStoriesByKind: false,
})

function loadStories() {
  require('../stories/sync.js')
  require('../stories/google.js')
}

configure(loadStories, module)
