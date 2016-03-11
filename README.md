# Sitegeist.Monocle

### A living styleguide for neos

This package will add a styleguide to the neos-modules that will render the 
TypoScript2 prototypes that are annotated with `@styleguide`.

### Authors & Sponsors

* Wilhelm Behncke - behncke@sitegeist.de
* Martin Ficzel - ficzel@sitegeist.de

*The development and the public-releases of this package is generously sponsored by our employer http://www.sitegeist.de.*

## Create items for the styleguide

To render a prototype as a styleguide-item it simply has to be annotated:

```
prototype(Vendor.Package:MyCustomPrototype) < prototype(TYPO3.TypoScript:Tag){
    @styleguide {
        path = 'atoms.basic'
        title = 'My Custom Prototype'
        description = 'A '
    }
    // ... other prototype settings ...
}    
```

## Best practices

It is a good idea and our intention to use Sitegeist.Monocle together with 
"atomic design" (see: http://patternlab.io/about.html) and "CSS BEM" 
(see: http://getbem.com/introduction/). Nevertheless Sitegeist.Monocle
will not enforce any of this.


