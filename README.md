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
        # Path of the component in the styleguide
        # Optional: by default the name-part of the component name is used
        #
        path = 'Components.Headline'

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
    }

    # normal fusion props
    tagName = 'h1'
    content = ''
}
```

The styleguide will render the items without the usual context. The ``site``, ``documenNode``
and ``node`` context variables are not present inside the styleguide rendering by intention.

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

That way the rendering prototype is completely separated from the mapping prototype and
therefore highly reusable.

The distinction between rendering- and mapping-prototypes can be compared to
presentational-components vs. container-components in the ReactJS world.

### Configuration

Some configuration is available to ui settings and to configure the preview.

```YAML
Sitegeist:
  Monocle:
    preview:
        # 
        # The fusion path that renders the preview. 
        # the available context is has the values 
        #  - sitePackageKey
        #  - prototypeName
        #  - propSet
        #  - props  
        # 
        fusionRootPath: '/<Sitegeist.Monocle:Preview.Page>'
        
        # 
        # The fusion prototype that is rendered initially
        # Optional: Will default to the first found prototype
        #
        defaultPrototypeName: 'Vendor.Site:Prototype'
```


### Configuration

All configurations can be overwritten for each site-package.

```YAML
Sitegeist:
  Monocle:
    packages:
      'Vendor.Site':
        preview: 
          fusionRootPath:  '/<Vendow.Site:Preview.Page>'
        ui:
          viewportPresets:
              xxl:
                label: 'extra wide'
                width: 1600
                height: 1000    
```

#### Default Prototype

Monocle will determine the prototype that is shown first automatically. It is however possible, to configure a specific prototype instead.

```YAML
Sitegeist:
  Monocle:
    preview:
      defaultPrototypeName: 'Vendor.SitePackage:Prototype'
```

#### Viewports

To configure the available viewport presets you can alter the following configuration. 

```YAML
Sitegeist:
  Monocle:
    ui:
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
```

#### Hotkeys (experimental)

Some elements of Monocle can be controlled via keyboard. All hotkeys in use can be configured via Settings. It seems though, this is not always working reliably - so please be aware, that you might experience strange side effects, when overriding the default hotkey configuration.

```YAML
Sitegeist:
  Monocle:
    ui:
      hotkeys:
        openNavigation: 'ctrl+f'
        closeNavigation: 'esc'
        navigateUp: 'up'
        navigateDown: 'down'
        openPreviewInNewWindow: 'ctrl+space'
```

#### Structure

At the heart of Monocles navigation mechanism sits the prototype selector. In this component you'll find all components that are annotated with `@styleguide`, grouped by configurable criteria.

A possible configuration for such a group looks like this:

```YAML
Sitegeist:
  Monocle:
    ui:
      structure:
        base:
          position: 100
          match: Components?\.Base
          label: Base
          icon: icon-minus
          color: '#AAA'
```

Under the configuration path `Sitegeist.Monocle.preview.structure`, you can define an arbitrary number of component groups. Each group consists of:

* A `label`, which will be displayed as such in the UI
* An `icon`, that is attached to each component in the group
* A `color`, that will be applied to the icon
* A `match`er - a regular expression that will be applied to the non-package part of the components prototype name and thus determines the affiliation of a component to the configured group.

Monocle ships with a default structure configuration that tries to represent an Atomic-Design-like structure. So, the configuration consists of defaults for `atoms`, `molecules`, `organisms` and `templates`.

Each component that doesn't match any of the configured groups will instead be put into the `unknown` group.

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
### Fusion 

Sitegeist.Monocle brings some fusion-prototypes that you can use or adjust to your needs.

- `Sitegeist.Monocle:Preview.Page` - Renders the preview Frame for a prototype, makes use of the prototypes below to do so
- `Sitegeist.Monocle:Preview.Prototype` - Render the preview for a single prototype 
- `Sitegeist.Monocle:Preview.Styles` - Style-tags for for the preview-page based on the setting `Sitegeist.Monocle.preview.additionalResources.styleSheets`
- `Sitegeist.Monocle:Preview.Scripts` - Script-tags for for the preview-page based on the setting `Sitegeist.Monocle.preview.additionalResources.javaScripts`
- `Sitegeist.Monocle:Preview.MetaViewport` - MetaViewport tag for the preview-page based on the setting `Sitegeist.Monocle.preview.metaViewport`

## Installation

Sitegeist.Monocle is available via packagist. `"sitegeist/monocle" : "~1.0"` to the require section of the composer.json or run `composer require sitegeist/monocle`.

We use semantic-versioning so every breaking change will increase the major-version number.

## Visual regression testing

Monocle can be used to render prototypes in isolation for visual regression testing tools.
For that you might want to consider the following points.

### Policies
```YAML
#
# make the monocle endpoints publicly available
# !!! do not use this in production this shoudl be used on the ci-server only!!!
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

```

### Routes

To make the monocle encpoints accessible without a db-connection available make sure to include the
monocle-routes before the neos-routes. Otherwise neos will try to resolve the path and fail due to a
missing db-connection.

## Contribution

We will gladly accept contributions. Please send us pull requests.
