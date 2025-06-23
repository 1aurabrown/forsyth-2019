import '../styles/theme.scss';

import 'regenerator-runtime/runtime'

import './coded-by';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import animations from './components/animate'
import * as quicklink from "quicklink";
import {focusHash, bindInPageLinks} from '@shopify/theme-a11y';
import cookiesEnabled from './cookies-enabled';

import {load} from '@shopify/theme-sections';
// import './sections/article-content';
import './sections/footer';
// import './sections/homepage-logo';
// import './sections/instagram-feed';
import './sections/navigation';
// import './sections/newsletter';
// import './sections/page';
// import './sections/press';
// import './sections/product';

import './templates/customers/addresses';
import './templates/customers/login';
// import './templates/gift_card';

import initProductMasonries from './components/product-masonry';

load('*')

animations()

initProductMasonries()

// Common a11y fixes
focusHash();
bindInPageLinks();
quicklink.listen({
  ignores: [
    /\/cart\/?/,
    /\/account\/?/,
    uri => uri.includes('#')
  ]
})

// Apply a specific class to the html element for browser support of cookies.
if (cookiesEnabled()) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}
