import '../coded-by';


import {cookiesEnabled} from '@shopify/theme-cart';

import {load} from '@shopify/theme-sections';
import '../sections/navigation';
import '../sections/footer';

load('*');


// Apply a specific class to the html element for browser support of cookies.
if (cookiesEnabled()) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}
