[![StyleCI](https://styleci.io/repos/56759262/shield?style=flat)](https://styleci.io/repos/56759262)

# Sitegeist.Monocle

## A living styleguide for Neos

This package adds a styleguide module to Neos that renders the
Fusion prototypes in isolation that are annotated with `@styleguide`.

### Authors & Sponsors

* Martin Ficzel - ficzel@sitegeist.de
* Wilhelm Behncke - behncke@sitegeist.de

*The development and the public-releases of this package is generously sponsored
by our employer http://www.sitegeist.de.*

### Living Styleguide

The Monocle-Module uses the real Fusion-code to render the annotated
prototypes in isolation. That way the styleguide is always up to date and cannot
diverge over time from the real codebase.

The Monocle was defined with Atomic-Design and pure Fusion without Fluid in
mind but the implementation is Coding-Style and Template-Engine agnostic. You can
use Monocle to render Fluid based Prototypes without any limitation.

## Usage

### Create items for the styleguide

To render a prototype as a styleguide-item it simply has to be annotated:

```
prototype(Vendor.Package:Components.Headline) < prototype(Neos.Fusion:Tag) {

    #
    # Styleguide annotation
    # if this annotation is present (even when empty) 
    # the prototype is rendered in the styleguide
    # 
    @styleguide {

        #
        # The title of the component
        # Optional:  by default the component name is splitted and reversed  
        #
        title = 'My Custom Prototype'
        
        #
        # A description of the component
        # Optional: By default empty.
        # 
        description = 'A Prototype ....'
        
        #
        # Fusion-props to override during the styleguide rendering
        # Optional: By default empty.
        # 
        props {
            content = 'Hello World'
        }
        
        #
        # Additional propSets can be used to preview-variants for a
        # prototype. The props of the active propSets will override 
        # only the specified props while defaults are still in place.  
        # 
        propSets {
            long {
                label = "Long Text"
                props {
                    content = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy "
                }
            }
            
            word {
                label = "Single Word Text"
                props {
                    content = 'Foobar'
                }
            }
        }
        
    }

    # normal fusion props 
    tagName = 'h1'
    content = ''
}
```

The styleguide will render the items without the usual context. The ``site``, ``documenNode`` 
and ``node`` context-variables are not present inside the styleguide rendering by intention.
 
That way it is ensured that your prototypes rely only on the fusion path for rendering and are 
not affected by editor data. This is important for reliable testing of components. 

To map an actual content node on a component-prototype use a separate fusion prototype.  

```
prototype(Vendor.Package:Content.Headline) < prototype(Neos.Fusion:Value){
    value = Vendor.Package:Components.Headline {
        content = ${q(node).property('title')}
    }
}
```

That way the rendering prototype is completely seperated from the mapping prototype and 
therefore highly reusable.

The distinction between rendering- and mapping-prototypes can be compared to 
presentational-components vs. container-components in the react-js world.

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
      
      # the prototype the styleguide will render at start    
      defaultPrototypeName: 'Vendor.Site:Component.Template.Default'
      
      # fusion root path that is used to render the frame around the component
      # the fusion gets the context-variables `sitePackageKey`, `prototypeName`, `
      # `propSet` and `props and shall render the prototype  
      fusionRootPath: '/<Sitegeist.Monocle:Preview.Page>'
      
      # the resources that are loaded in the preview iFrames 
      additionalResources:
        styleSheets:
          # example:  'resource://Vendor.Site/Public/Styles/Main.css'
        javaScripts:
          # example: 'resource://Vendor.Site/Public/Scripts/Main.js'
          
      # patterns to structure the components in the search dialog into 
      # different groups that are visually seperated by icon and color
      structure:
        base:
          position: 100
          match: Components?\.Base
          label: Base
          icon: icon-minus
          color: '#AAA'

```

### Fusion-prototypes

Sitegeist.Monocle brings some fusion-prototypes that you can use or adjust to your needs.
 
- `Sitegeist.Monocle:Preview.Page` - Renders the preview Frame for a prototype, makes use of the prototypes below to do so
- `Sitegeist.Monocle:Preview.Prototype` - Render the preview for a prototype 
- `Sitegeist.Monocle:Preview.Styles` - Style-tags for for the preview-page based on the setting `Sitegeist.Monocle.preview.additionalResources.styleSheets`
- `Sitegeist.Monocle:Preview.Scripts` - Script-tags for for the preview-page based on the setting `Sitegeist.Monocle.preview.additionalResources.javaScripts`
- `Sitegeist.Monocle:Preview.MetaViewport` - MetaViewport tag for the preview-page based on the setting `Sitegeist.Monocle.preview.metaViewport`

## Installation

Sitegeist.Monocle is available via packagist. `"sitegeist/monocle" : "~1.0"` to the require section of the composer.json or run `composer require sitegeist/monocle`. 

We use semantic-versioning so every breaking change will increase the major-version number.

## Visual regression testing

Monocle can be used to render prototypes in isolation for visual regression testing tools. 
For that you might want to consider the following points. 

### Routing

The default subroutes for the monocle submodule are included automatically via Settings.

### Policies

By default the monocle modules are made available for the role `Neos.Neos:AbstractEditor`. 

If you want to render the styleguide without authentication the following configuration makes the
needed endpoints under the path local path `preview/module` available without any authentication 
and even without a database-connection present.

```YAML
#
# !!! do not use this in production this shoud be used for development and testing only!!!
#
roles:
  'Neos.Flow:Everybody':
    privileges:
      -
        privilegeTarget: 'Sitegeist.Monocle:Styleguide.Preview'
        permission: GRANT
      -
        privilegeTarget: 'Sitegeist.Monocle:Styleguide.Api'
        permission: GRANT
      -
        privilegeTarget: 'Sitegeist.Monocle:Styleguide.Module'
        permission: GRANT
```

### Routes

To make the monocle encpoints accessible without a db-connection available make sure to include the 
monocle-routes before the neos-routes. Otherwise neos will try to resolve the path and fail due to a
missing db-connection.

## Contribution

We will gladly accept contributions. Please send us pull requests.
