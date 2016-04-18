# Sitegeist.Monocle

### A living styleguide for neos

This package adds a styleguide module to neos that renders the 
TypoScript2 prototypes in isolation that are annotated with `@styleguide`.

ATTENTION: THIS IS A PROTPTYPE EVERYTHING IN HERE MIGHT CHANGE! 

### Authors & Sponsors

* Martin Ficzel - ficzel@sitegeist.de

*The development and the public-releases of this package is generously sponsored 
by our employer http://www.sitegeist.de.*

## Create items for the styleguide

To render a prototype as a styleguide-item it simply has to be annotated:

```
prototype(Vendor.Package:MyCustomPrototype) < prototype(TYPO3.TypoScript:Tag){
    @styleguide {
        path = 'atoms.basic'
        title = 'My Custom Prototype'
        description = 'A Prototype ....'

        # render the prototype in a single iframe 
        # display = 'iframe'
        
        # define the height of the protortype iframe
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

## Configuration

Some configuaration is needed to define the JS and CSS that has to be included for the preview.

```
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

## Best practices

It is a good idea and our intention to use Sitegeist.Monocle together with 
"atomic design" (see: http://patternlab.io/about.html) and "CSS BEM" 
(see: http://getbem.com/introduction/). Nevertheless Sitegeist.Monocle
will not enforce any of this.


