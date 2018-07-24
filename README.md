[![StyleCI](https://styleci.io/repos/56759262/shield?style=flat)](https://styleci.io/repos/56759262)

# Sitegeist.Monocle

<img src="./Resources/Public/Images/monocle_imagemark.svg" width="300" />

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

## Installation

Sitegeist.Monocle is available via packagist. `"sitegeist/monocle" : "~4.0"` to the require section of the composer.json 
or run `composer require sitegeist/monocle`.

We use semantic-versioning so every breaking change will increase the major-version number.

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
        # Alternate prop sets that can overload the default props
        # Optional: By default empty.
        #
        propSets {
            'level 2' {
                tagName = 'h2'
            }
            'long text' {
                content = 'Lorem ipsum dolor sit amet ...'
            }
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

### Simulate API-Endpoints

Monocle has fusion-prototypes to simulate json api responses for components.

- `Sitegeist.Monocle:DataUri`: Generic data uri implementation that expects `type` and `content` as string
- `Sitegeist.Monocle:DataUri.Json`: And endpoint-mock with media-type `application/json` that will pass `content` trough Json.stringify
- `Sitegeist.Monocle:DataUri.Text`: And endpoint-mock with media-type `text/plain`

The DataUri-Prototypes will encode the content as base64.

```
prototype(Vendor.Package:Component.SearchExample) < prototype(Neos.Fusion:Component) {
	@styleguide {
		props {
			endpointUrl = Sitegeist.Monocle:DataUri.Json {
				content = Neos.Fusion:RawArray {
					term = 'hamburch'
					suggestedTerm = 'hamburg'
				}
			}
		}
	}

	endpointUrl = null

	renderer = afx`
		<div data-endpoint-url={props.endpointUrl} />
	`
}
```

### Preview Configuration

Some configuration is available to configure the preview.

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
  
        # 
        # The query selector that is used to extract the component html 
        # from the preview to the html-view. 
        # Optional: Default is 'body'
        #       
        sourceQuerySelector: 'body'

```

To include your styles and scripts into the preview you can extend the `Sitegeist.Monocle:Preview.Page` prototype the 
same way you would customize `Neos.Neos:Page`. 

```
//
// Add stylesheets to to the preview-prototype
//
prototype(Sitegeist.Monocle:Preview.Page) {
    head {
        stylesheets.main = Vendor.Site:Resources.Styles
        javascripts.main = Vendor.Site:Resources.Scripts
    }

    bodyScripts = Vendor.Site:Resources.BodyScripts {
        @position = 'before closingBodyTag'
    }
} 

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

#### Locales

If you have translations in your component you can configure the available locales via settings

```YAML
Sitegeist:
  Monocle:
    ui:
      localePresets:
        en:
          label: 'English'
          fallback: ['en_UK', 'en']
        de:
           label: 'German'
           fallback: ['de', 'en']
        fr:
          label: 'French'
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
        navigateUp: 'up's
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

#### Hide components

If you do not want to display components, you can define hiddenPrototypeNamePatterns as follows:

```YAML
Sitegeist:
  Monocle:
    hiddenPrototypeNamePatterns:
      - 'Vendor.Site:*'
      - 'Another.Vendor.Site:Prototype'
```

### Site-specific configuration

All configurations can be overwritten for each selected site package.

```YAML
Sitegeist:
  Monocle:
    packages:
      'Vendor.Site':
        ui:
          viewportPresets:
              xxl:
                label: 'extra wide'
                width: 1600
                height: 1000    
```

### Fusion Object Tree Caching

Monocle will cache the fusion code for every site package. To invalidate this cache
the the Fusion directories of all packages are monitored and changes trigger the flushing
of the fusion-cache.

The setting `Sitegeist.Monocle.fusion.enableObjectTreeCache` enables the caching in Monocle by default.

### Routes

The monocle Routes are included automatically via Settings.

### Fusion

Sitegeist.Monocle brings some fusion-prototypes that you can use or adjust to your needs.

#### `Sitegeist.Monocle:Preview.Page`

The prototype `Sitegeist.Monocle:Preview.Page` renders the preview view for a prototype, to do so it uses `Sitegeist.Monocle:Preview.Prototype` below. 
You can extend this prototype to add your styles and scripts as you would with `Neos.Neos:Page`. 

#### `Sitegeist.Monocle:Preview.Prototype`

The prototype `Sitegeist.Monocle:Preview.Prototype` is used to render a single prototype with applied styleguide props. 
This is useful if you want to provide the result as prop to the preview of another prototype. 

```
prototype(Vendor.Site:Container) {
    @styleguide{
        props.content = Sitegeist.Monocle:Preview.Prototype {
            prototypeName = 'Vendor.Site:Item'
            propSet = 'large'
        }
    }
    ...
}
```

## Policies

Monocle comes with four privilege targets to control access.

- `Sitegeist.Monocle:Backend.Styleguide` : call the backend module that will open the styleguide 
- `Sitegeist.Monocle:Styleguide.Api` : request informations about prototypes etc. via api (used from the module)
- `Sitegeist.Monocle:Styleguide.Preview` : show a preview for a prototype
- `Sitegeist.Monocle:Styleguide.Module` : show the styleguide

### Policies for different Contexts

- In `Production`-context all monocle privileges are by default granted to the group `Neos.Neos:AbstractEditor`.
  That way only backend-uses can see the styleguide.
- In `Development`-context the Sitegeist.Monocle:Styleguide privileges are granted to the group `Neos.Flow:Everybody`.
  That way the Styleguide can be accessed without any database via url http://127.0.0.1:8081/monocle/preview/module .
- For integration into ci-processes you grant access to the privileges `Sitegeist.Monocle:Styleguide.Preview` and
  `Sitegeist.Monocle:Styleguide.Api` to the ci-system.

## Contribution

We will gladly accept contributions. Please send us pull requests.
