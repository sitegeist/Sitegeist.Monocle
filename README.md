# ATTENTION: THIS IS A PROTOTYPE EVERYTHING IN HERE MIGHT CHANGE! 

# Sitegeist.Monocle

## A living styleguide for Neos

This package adds a styleguide module to Neos that renders the 
TypoScript2 prototypes in isolation that are annotated with `@styleguide`.

### Authors & Sponsors

* Martin Ficzel - ficzel@sitegeist.de

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
    preview:
      defaultPath: 'atoms'
      additionalResources:
        styleSheets:
          # example:  'resource://Vendor.Site/Public/Styles/Main.css'
        javaScripts:
          # example: 'resource://Vendor.Site/Public/Scripts/Main.js'
```

### Routes

If not already present, you have to include the standard Flow routes into the `Routes.yaml` of
your distribution.

```YAML
##
# Flow subroutes
-
  name: 'Flow'
  uriPattern: 'flow/<FlowSubroutes>'
  defaults:
    '@format': 'html'
  subRoutes:
    FlowSubroutes:
      package: TYPO3.Flow
```

# Best practices

## Atomic-Design with TS2

It is a good idea and our intention to use Sitegeist.Monocle together with 
"atomic design" (see: http://patternlab.io/about.html) and "CSS BEM" 
(see: http://getbem.com/introduction/). Nevertheless Sitegeist.Monocle
will not enforce any of this.

### Define and extend atoms

```
prototype(Vendor.Site:Atoms.Link) < prototype(TYPO3.TypoScript:Tag) {
  tagName = 'a'
  ...
}
prototype(Vendor.Site:Atoms.Button) < prototype(Vendor.Site:Atoms.Link) {
attributes.class = TYPO3.TypoScript:RawArray {
  button = 'btn'
}
  ...
}
```

### Aggregate atoms to higher order components

```
prototype(Vendor.Site:Molecules.ButtonGroup) < prototype(TYPO3.TypoScript:Tag) {
  content = TYPO3.TypoScript:Array {
    button1 = Vendor.Site:Atoms.Button
    button2 = Vendor.Site:Atoms.Button
  }
  prototype(Vendor.Site:Atoms.Button) {
    attributes.class.buttonGroup = 'buttonGroup'
  }
}

prototype(Vendor.Site:Organisms.Header) < prototype(TYPO3.TypoScript:Tag) {
   content = TYPO3.TypoScript:Array {
     funcNav = Vendor.Site:Mulecules.FuncNav
     mainNav = Vendor.Site:Mulecules.MainNav
   }
}

prototype(Vendor.Site:Templates.Page) < prototype(TYPO3.Neos:Page) {
   content = TYPO3.TypoScript:Array {
     header = Vendor.Site:Organisms.Header
     main = TYPO3.Neos:PrimaryContent
     footer = Vendor.Site:Organisms.Header
   }
}
```

### Use component for page rendering

```
page = TYPO3.TypoScript:Case {
  specificPage {
    condition = ${q(documentNode).is('[instanceof Vendor.Site:SpecificPageMixin]')}
    renderPath = Vendor.Site:Templates.PageSpecific
  }
  default {
    condition = true
    renderer = Vendor.Site:Templates.Page
  }  
}
```

### Use component for custom nodetype

```
prototype(Vendor.Site:ExampleNode) < prototype(Vendor.Site:Molecules.Example) {
  # this has to be done because of auto generated TS
  templatePaths = NULL 
  # map node properties
  exampleProperty = ${q(node).property('propertyName')}
}
```
