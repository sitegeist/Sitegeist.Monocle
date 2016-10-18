[![StyleCI](https://styleci.io/repos/56759262/shield?style=flat)](https://styleci.io/repos/56759262)

# Sitegeist.Monocle

## A living styleguide for Neos

This package adds a styleguide module to Neos that renders the
TypoScript2 prototypes in isolation that are annotated with `@styleguide`.

### Authors & Sponsors

* Martin Ficzel - ficzel@sitegeist.de
* Wilhelm Behncke - behncke@sitegeist.de

*The development and the public-releases of this package is generously sponsored
by our employer http://www.sitegeist.de.*

### Living Styleguide

The Monocle-Module uses the real TypoScript2 code to render the annotated
prototypes in isolation. That way the styleguide is always up to date and cannot
diverge over time from the real codebase.

The Monocle was defined with Atomic-Design and pure TypoScript2 without Fluid in
mind but the implementation is Coding-Style and Template-Engine agnostic. You can
use Monocle to render Fluid based Prototypes without any limitation.

## Usage

### Create items for the styleguide

To render a prototype as a styleguide-item it simply has to be annotated:

```
prototype(Vendor.Package:MyCustomPrototype) < prototype(TYPO3.TypoScript:Tag){
    @styleguide {
        path = 'atoms.basic'
        title = 'My Custom Prototype'
        description = 'A Prototype ....'

        # an optional class for the wrapping div of the preview
        # previewContainerClass = 'class-with-nice-background'

        # render the prototype in a single iframe
        # display = 'iframe'

        # define the height of the prototype iframe
        # height = 600

        # ts props to override for the styleguide rendering
        props {
            content = 'Hello World'
        }
    }

    // normal ts props
    content = ''
}
```

### Configuration

Some configuration is needed to define the JS and CSS that has to be included for the preview.

```YAML
Sitegeist:
  Monocle:
    # define the breakpoints the styleguide will offer
    viewportPresets:
      xs:
        label: 'xtra small'
        width: 400
        height: 600
      md:
        label: 'medium'
        width: 600
        height: 400
      l:
        label: 'wide'
        width: 800
        height: 600
    
    preview:
      # the path the styleguide will show at start    
      defaultPath: 'atoms'
      # the resources that are loaded in the preview iFrames 
      additionalResources:
        styleSheets:
          # example:  'resource://Vendor.Site/Public/Styles/Main.css'
        javaScripts:
          # example: 'resource://Vendor.Site/Public/Scripts/Main.js'
```

### Routes

If the default flow subroutes are not included in your main Routes.yaml you can add the following
routes to your global Routes.yaml and only enable the monocle-subroutes.

```YAML
##
# Sitegeist.Monocle subroutes

-
  name: 'Monocle'
  uriPattern: 'sitegeist/monocle/<MonocleSubroutes>'
  subRoutes:
    'MonocleSubroutes':
      package: 'Sitegeist.Monocle'
```


## Installation

Sitegeist.Monocle eventually will become available via packagist. After that just add `"sitegeist/monocle" : "~1.0"` to the require-dev section of the composer.json or run `composer require sitegeist/monocle`. We use semantic-versioning so every breaking change will increase the major-version number.

In the meantime you can add the following lines to your composer.json.

```JSON
{
    "repositories": [
        {
            "url": "git@github.com:sitegeist/Sitegeist.Monocle.git",
            "type": "vcs"
        }
    ],
    "require": {
        "sitegeist/monocle": "dev-master",
    },
}
``` 

## Contribution

We will gladly accept contributions. Please send us pull requests.
