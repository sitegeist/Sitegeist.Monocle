# PropEditors

## Sitegeist.Monocle/Props/Editors/TextField

**Configuration Schema**

-None-

**Example**
```
prototype(Vendor.Package:MyComponent) < prototype(Neos.Fusion:Component) {
	@styleguide {
        options {
            propEditors {
                titleText {
                    editor = 'Sitegeist.Monocle/Props/Editors/TextField'
                }
            }
        }
    }
}
```

## Sitegeist.Monocle/Props/Editors/TextArea

**Configuration Schema**

-None-

**Example**
```
prototype(Vendor.Package:MyComponent) < prototype(Neos.Fusion:Component) {
	@styleguide {
        options {
            propEditors {
                descriptionText {
                    editor = 'Sitegeist.Monocle/Props/Editors/TextArea'
                }
            }
        }
    }
}
```

## Sitegeist.Monocle/Props/Editors/Checkbox

**Configuration Schema**

-None-

**Example**
```
prototype(Vendor.Package:MyComponent) < prototype(Neos.Fusion:Component) {
	@styleguide {
        options {
            propEditors {
                isVisible {
                    editor = 'Sitegeist.Monocle/Props/Editors/Checkbox'
                }
            }
        }
    }
}
```

## Sitegeist.Monocle/Props/Editors/SelectBox

**Configuration Schema**
|Property|Type|Description|
|-|-|-|
|options|`list` or `dictionary`|List of available options for the select box|
|options[].label|`string`|Label that should be displayed for the option|
|options[].value|`string` or `int` or `float`|Value of the option|

**Example**
```
prototype(Vendor.Package:MyComponent) < prototype(Neos.Fusion:Component) {
	@styleguide {
        options {
            propEditors {
                headlineType {
                    editor = 'Sitegeist.Monocle/Props/Editors/SelectBox'
                    editorOptions {
                        options {
                            h1 {
                                label = 'H1'
                                value = 'h1'
                            }
                            h2 {
                                label = 'H2'
                                value = 'h2'
                            }
                            h3 {
                                label = 'H3'
                                value = 'h3'
                            }
                        }
                    }
                }
            }
        }
    }
}
```
