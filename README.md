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

Sitegeist.Monocle is available via packagist and can be installed with the command `composer require sitegeist/monocle`.

We use semantic-versioning so every breaking change will increase the major-version number.

## Usage

### Create items for the styleguide

To render a prototype as a styleguide-item it simply has to be annotated:

```
prototype(Vendor.Package:Components.Headline) < prototype(Neos.Fusion:Component) {

    #
    # styleguide annotation to define title, description and props for the styleguide
    #
    @styleguide {
        title = 'My Custom Prototype'
        description = 'A Prototype ....'
        props {
            content = 'Hello World'
        }
        useCases {
            h2 {
                title = "My Custom Prototype as Headline 2"
                props {
                    tagName = 'h2'
                    content = 'Alternate styleguide content for h2'
                }
            }
        }
    }

    #
    # normal fusion props and renderer
    #
    tagName = 'h1'
    content = ''

    renderer = afx`
        <Neos.Fusion:Tag tagName={props.tagName}>{props.content}</Neos.Fusion:Tag>
    `
}
```

The styleguide will render the items without the usual context. The ``site``, ``documenNode``
and ``node`` context variables are not present inside the styleguide rendering by intention.

That way it is ensured that your prototypes rely only on the fusion path for rendering and are
not affected by editor data. This is important for reliable testing of components.

To map an actual content-node on a component-prototype use a separate fusion prototype.

```
prototype(Vendor.Package:Content.Headline) < prototype(Neos.Neos:ContentComponent){
    content = ${q(node).property('title')}

    renderer = Vendor.Package:Components.Headline {
        @apply.props = ${props}
    }
}
```

That way the rendering prototype is completely separated from the mapping prototype and
therefore highly reusable.

The distinction between rendering- and mapping-prototypes can be compared to
presentational-components vs. container-components in the ReactJS world.

### Preview Containers

Often components have to be rendered in the styleguide inside another component. In this case a `container`
can be defined in the styleguide annotation. The container is applied as a processor to the currently previewed
prototype with the rendered content available as `value` in the context.

```
prototype(Vendor.Site:ExampleComponent) < prototype(Neos.Fusion:Component) {
    @styleguide {
        container = Vendor.Site:ExampleContainer {
            content = ${value}
        }
    }

    renderer = afx`
        <h1>Hello World</h1>
    `
}
```

*For flexibility it is advisible to define a prop `content = ${value}` on container prototyoes which ensures
that the containers can be used as processor or via afx with tag children.*

```
prototype(Vendor.Site:ExampleContainer) < prototype(Neos.Fusion:Component) {
    content = ${value}
    renderer = afx`
        <div class="container">{props.content}</div>
    `
}

# Use of container as processor ... content passed via `value` context
example_processor = 'Hello World'
example_processor.@process.inContainer = Vendor.Site:ExampleContainer

# Use of container in afx ... content passed as `content`-prp
example_afx = afx`
    <Vendor.Site:ExampleContainer>Hello World'</Vendor.Site:ExampleContainer>
`
```

*When multiple styleguide elements are nested please note that only the container for the outermost element will be rendered. For all nested elements
the container will be omitted. This also applies to prototypes rendered by `Sitegeist.Monocle:Preview.Prototype`.*

### Use Cases

The `useCases` section of the styleguide annotation allows to configure scenarios the component shall be previewed in.
If a useCase defines `props` or `container` those are will override the styleguide settings for this component. The `title`
is optional and will fallback to the key the useCase is defined in.

```
prototype(Vendor.Site:Example.Component) < prototype(Neos.Fusion:Component) {

    @styleguide {
        title = "Example"

        container = Vendor.Site:Example.Container
        props {
            title = 'Hello world!'
        }

        useCases {
            case1 {
                title = "Use case with varying props"
                props {
                    title = Hello special world!'
                }
            }
            case2 {
                title = "Use case with another container"
                container = Vendor.Site:Example.AnotherContainer
            }
        }
```

### Prop Sets !!!deprecated!!!

!!! PropSets are deprecated and should not be mixed with UseCases. Monocle will not show the PropSet selector for components
that have useCases and the API endpoint will ignore propSets once a useCase is selected. The PropSet Feature will be
removed in one of the next major versions once if causes extra effort to the monocle maintenance !!!

PropSets allow to specify additional values for props that are merged into the main styleguide props of a component to
allow to simulate wider range of scenarios a component may be used.

```
prototype(Vendor.Site:Example.Component) < prototype(Neos.Fusion:Component) {

    @styleguide {
        title = "Example"
        props {
            title = 'Hello world!'
        }
        propSets {
            longTitle {
                title = 'A very long title for testing ... because reasons'
            }
        }
    }
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
#### Grids

The key `grids` in the monocle ui configuration allows to specify a responsive layout grid visualization
that can be activated in the monocle ui or the preview endpoint.

Each grid has the following options:
* `mediaQuery` (string, required) media query the grid shall be active for
* `columns` (int, required) number of columns
* `gap` (string, required) gap between columns, css units like "10px"
* `gutter` (string, required) border around of the grid, css dimensions like for padding "0px 20px"

* `label` (string, optional) name of the grid configuration
* `width` (string, default: 100%) css with of the grid. default
* `maxWidth` (string, optional) css max-with of the grid
* `margin` (string, default: "0px auto") css margin around the grid

!!! The grid visualization assumes that the body of the document has no padding or margin. If this is not the case the grid may not
be positioned or dimensioned correctly !!!

```YAML
Sitegeist:
  Monocle:
    ui:
      grids:
        small:
          mediaQuery: '(min-width:0px) and (max-width: 599px)'
          label: "Small"
          columns: 4
          gap: 16px
          gutter: 10px 20px
        medium:
          mediaQuery: '(min-width:600px) and (max-width: 1023px)'
          label: Medium
          columns: 8
          gap: 16px
          gutter: 10px 20px
        large:
          mediaQuery: '(min-width:1024px)'
          label: Large
          columns: 12
          maxWidth: 1024px
          gap: 16px
          gutter: 10px 20px
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

Specific components can be "unhidden" even if they match one of the `hiddenPrototypeNamePatterns` patterns:

```YAML
Sitegeist:
  Monocle:
    alwaysShowPrototypes:
      - 'Vendor.Site:Some.Component.ThatShouldBeShown'
      - 'Another.Vendor.Site:Prototype.ThatShouldBeShown'
```

This allows for including prototypes of packages selectively.

### Package-specific configuration

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

This packages configuration can also be used to configure non-site packages for previewing in the styleguide.

When a prototyope of a non-site package is rendered Monocle will only load the Root.fusion of this specific package and the Monocle Root.fusion. Every other fusion including the default fusion has to be included
explicitly. This mimics the behavior of the classic FusionView that is used for FusionRendering of Flow Controller Actions.

```YAML
Sitegeist:
  Monocle:
    packages:
      #add a key to the package list without package specific configuration
      'Vendor.Example': {}
```

### Fusion

Sitegeist.Monocle brings some fusion-prototypes that you can use or adjust to your needs.

#### `Sitegeist.Monocle:Preview.Page`

The prototype `Sitegeist.Monocle:Preview.Page` renders the preview view for a prototype, to do so it uses `Sitegeist.Monocle:Preview.Prototype` below.
You can extend this prototype to add your styles and scripts as you would with `Neos.Neos:Page`.

```
prototype(Sitegeist.Monocle:Preview.Page) {
    head {
        metaViewport = '<meta name="viewport" content="width=device-width">'

        stylesheets.main =  Neos.Fusion:Tag {
            tagName = 'link'
            attributes.rel = 'stylesheet'
            attributes.href = Neos.Fusion:ResourceUri {
                path = 'resource://Vendor.Site/Public/Styles/main.css'
            }
        }

        javascripts.main = Neos.Fusion:Tag {
            tagName = 'script'
            attributes.src = Neos.Fusion:ResourceUri {
                path = 'resource://Vendor.Site/Public/JavaScript/main.js'
            }
        }
    }
}
```

*You have to add the same header informations to `Sitegeist.Monocle:Preview.Page` AND to `Neos.Neos:Page` to make ensure the rendered result in the styleguide
is identical to the frontend. To do it is recommended to centralize those in fusion-components.*

#### `Sitegeist.Monocle:Preview.Prototype`

The prototype `Sitegeist.Monocle:Preview.Prototype` is used to render a single prototype with applied styleguide props.
This is useful if you want to provide the result as prop to the preview of another prototype.

The prototyoe allows to specify the following options:

* `prototypeName`: string The name of the prototyoe
* `propSet`: string the name of the propSet that is applied in addition to the default props
* `props`: array key => value pairs that are applied in addition to the defaultProps and the propSet

The following example shows how the `Sitegeist.Monocle:Preview.Prototype` can be used to render a preview inside of a styleguide prop:

```
prototype(Vendor.Site:ContainerExample) {
    @styleguide{
        props.content = Sitegeist.Monocle:Preview.Prototype {
            prototypeName = 'Vendor.Site:Item'
            propSet = 'large'
        }
    }
    ...
}
```

### Simulate API-Endpoints

Monocle has fusion-prototypes to simulate json api responses for components.

#### `Sitegeist.Monocle:DataUri`

Generic data uri implementation that expects `type` and `content` as string

```
    endpointUrl = Sitegeist.Monocle:DataUri {
        content = '{"hello":"world"}'
        type = 'application/json'
    }
```

The DataUri-Prototypes will encode the content as base64.
Attention: Data Uris do not accept url-parameters. If you frontend code adds arguments to the mock you have to be aware of that.

For convenience special prototypes for json and text exist:

- `Sitegeist.Monocle:DataUri.Json`: And endpoint-mock with media-type `application/json` that will pass `content` trough Json.stringify
- `Sitegeist.Monocle:DataUri.Text`: And endpoint-mock with media-type `text/plain`

#### `Sitegeist.Monocle:MirrorUri`

Create an uri to an monocle endpoint that returns the passed content with the given type

```
    endpointUrl = Sitegeist.Monocle:MirrorUri {
        content = '{"hello":"world"}'
        type = 'application/json'
    }
```

Attention: Browsers will often crop the urls to a maximal length, be aware of that if you mock large json-structures.

For convenience special prototypes for json and text exist:

- `Sitegeist.Monocle:MirrorUri.Json`: And endpoint-mock with media-type `application/json` that accepts RawArray data
- `Sitegeist.Monocle:MirrorUri.Text`: And endpoint-mock with media-type `text/plain`


#### `Sitegeist.Monocle:StaticUri`

Create an URI that will return the content of the file and the contentType for the given key.

```
    endpointUrl = Sitegeist.Monocle:StaticUri {
        key = 'example'
    }
```

The path and content type for each key are configured via Settings:

```yaml
Sitegeist:
  Monocle:
    uriMock:
      static:
        example:
          path: 'resource://Vendor.Package/Private/Json/example.json'
          contentType: 'application/json'
```

#### Mocking Uris inside the styleguide

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

### Props & Prop Editors

While previewing Fusion prototypes the Monocle UI offers a mechanism to override certain properties of that prototype in an ad-hoc fashion. This allows you to quickly examine whether your prototype works in certain unforseen configurations (longer or shorter text for instance).

Monocle will try to reproduce the API of your prototype from multiple sources and will offer all props as editable that can be plausibly associated with a specific editor configuration. By default, Monocle will scan the `@styleguide.props` path in your fusion code for prop values. If your prototype happens to be a `Neos.Fusion:Component` (which in most cases it'll likely be), Monocle also scans all default values of your Component props.

Given a prop value, Monocle will check its type and provide a fitting editor configuration. Below is a table for all standard cases:

| Value Type | Editor |
|-|-|
| `string` (with less than 81 characters) | TextField |
| `string` (with more than 80 characters) | TextArea |
| `int` or `float` | TextField |
| `boolean` | CheckBox |

Additionally, if you need more control over which editor is used you may include a custom configuration under the `@styleguide.options.propEditors` path in your fusion code:

```
prototype(Vendor.Package:MyAlertComponent) < prototype(Neos.Fusion:Component) {
    @styleguide {
        options {
            propEditors {
                severity {
                    editor = 'Sitegeist.Monocle/Props/Editors/SelectBox'
                    editorOptions {
                        options {
                            info {
                                label = 'Info'
                                value = 'info'
                            }
                            success {
                                label = 'Success'
                                value = 'success'
                            }
                            warning {
                                label = 'Warning'
                                value = 'warning'
                            }
                            error {
                                label = 'Error'
                                value = 'error'
                            }
                        }
                    }
                }
            }
        }
    }
}
```

An overview of available editors can be found under [[PropEditors](./Documentation/PropEditors.md)].

If you are using [`PackageFactory.AtomicFusion.PropTypes`](https://github.com/PackageFactory/atomic-fusion-proptypes) then check out [`Sitegeist.Monocle.PropTypes`](https://github.com/sitegeist/Sitegeist.Monocle.PropTypes). This package automatically generates editor configurations that that fit your PropTypes.

#### Hide props in Inspector

Sometimes it can be useful to remove editors for props completely (for example for props that contain HTML). This can be done with the `hidePropsInInspector` option:

```
prototype(Vendor.Package:SomeComponent) < prototype(Neos.Fusion:Component) {
    @styleguide {
        options {
            hidePropsInInspector = ${['header', 'content']}
        }
    }
}
```

### Fusion Object Tree Caching

Monocle will cache the fusion code for every site package. To invalidate this cache
the the Fusion directories of all packages are monitored and changes trigger the flushing
of the fusion-cache.

The setting `Sitegeist.Monocle.fusion.enableObjectTreeCache` enables the caching in Monocle by default.

### Routes

The monocle Routes are included automatically via Settings.

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
