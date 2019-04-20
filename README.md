# dev-cli
Development CLI made with Node.js that includes tools created to help improve development efficiency.

##### To Install:

```$xslt
npm i -g @dhuebner/dev-cli
```

##### To Install locally for development:
Clone this Repo and cd into it to install:

```$xslt
npm i -g .
```

##### To Configure the Generate command:
The **generate** command can be configured to reference your own generatable templates directory.

```
dev config generate
```

---

## Help
See available commands:
```$xslt
dev help
```

See details on generator command:
```$xslt
dev help generate
```

See details on snippet command:
```$xslt
dev help snip
```

See details on config command:
```$xslt
dev help config
```

See details on generate command configuration:
```$xslt
dev help config-generate
```


## Generate

The shorthand command is **dev g**

See details on generator command:
```$xslt
dev help generate
```

#### Generating a New Project

The **generate** command generates a new project based on a template project with any number of custom variables.

Upon entering the command, you will be prompted to provide values for each custom variable for that particular template.

Generate a new project:
```$xslt
dev generate <project_type> <new_project_name>
```

Once you provide values for each prompt you will be able to cd into your newly generated project and install any package dependencies.

#### Creating a New Generator Template Project

Generator Template projects are boiler plate projects that include custom variables delimited with **{% %}** by default for example, **{%someCustomVar%}**.

##### Custom Delimiters: 

You can also specify a **custom delimiter** for each generatable template instead of the default delimiter **{% %}**. For example, if you want to create a generatable template for a Django project (Django uses {% %} as framework syntax) you can specify a different delimiter for that template such as '==|| ||==' or '<) (>', etc.
Your custom delimiter can be any series of characters separated by one or more spaces. To set a custom delimiter for a given generator template you just have to add a "delimiter" property to the corresponding object in the **seedProjectsDirectory.json** file and give it a string value with any series of characters separated by one or more spaces. 
See the "example" generatable template in the templates directory within the dev-cli project for reference.

##### To Create a Generator Template

To Create a Generator Template, create a base project that you want to be able to generate, and replace file names and file content with as many custom variables (delimited with **{% %}**) as needed.

##### Variable Casing

You can also specify **casing** for any custom variables such as model names that may need to be in several cases throughout your project. You specify casing in your template projects by adding a case **(in camelCase)** inside **[ ]** brackets at the end of the variable. See example below:

Ex) If you have a model in a file that you want to be represented with a custom variable {%firstModel%} with a value of 'fooBar', you may have a need to express that variable value in camelCase, as well as capitalized, in lowerCase, in kebabCase, in underscoreCase, etc.

**capitalized** 

You can add a capitalized permutation of **{%firstModel%}** within the template project like this: **{%firstModel[capitalized]%}** which would result in a value of 'FooBar'.

**kebabCase**

You can add a kebab-case permutation of **{%firstModel%}** within the template project like this: **{%firstModel[kebabCase]%}** which would result in a value of 'foo-bar'.

**underscoreCase**

You can add an underscore_case permutation of **{%firstModel%}** within the template project like this: **{%firstModel[underscoreCase]%}** which would result in a value of 'foo_bar'.

**lowerCase**

You can add a lowercase permutation of **{%firstModel%}** within the template project like this: **{%firstModel[lowerCase]%}** which would result in a value of 'foobar'.

**upperCase**

You can add an UPPERCASE permutation of **{%firstModel%}** within the template project like this: **{%firstModel[upperCase]%}** which would result in a value of 'FOOBAR'.

##### If you have not configured the generate command to use your own custom seed templates directory, New Template Projects must be added to the "templates" directory within the dev-cli project in order to be used. Otherwise, they should be added to your own custom generatable templates directory.

##### New Template Projects' meta-data (name, description, custom variables, etc.) must be added to the seedProjectsDirectory.json file in the "templates" directory (either internal or custom depending on how the generate command is configured).

#### *Functionality to automatically add new Template Projects coming soon!

## Snippet

The shorthand command is **dev snip** or **dev s**

The **snippet** command lets you select and copy saved snippets to your clipboard, or create new snippets from the current content copied to your clipboard. 

See details on snippet command:
```$xslt
dev help snip
```

#### Selecting a Snippet

Select a saved snippet to copy to your clipboard.

```$xslt
dev snip
```

#### Creating a new Snippet

Create a new snippet from the current content copied to your clipboard.

To make a new snippet, copy the content you would like to save as a snippet to your clipboard and type the command below.

You will be prompted to add a **name** and a **description**.

```$xslt
dev snip new
```

Once you enter values for the name and description, your new snippet will be saved and ready to use.

## Config

The shorthand command is **dev config**

The **config** command lets you configure settings for a given CLI command. 

See details on config command:
```$xslt
dev help config
```

#### Configuring Generate command

Enter a custom templates directory for the generate command to use.
A custom generatable templates directory should include at least one generatable template project and a **seedProjectsDirectory.json** file that looks something like this:

```
{
  "seedProjects": [
    {
      "name": "example",
      "description": "Example seed project - just text files",
      "customVariables": {}
    },
    {
      "name": "node-cli",
      "description": "Pure Node.js CLI seed project - No dependencies",
      "customVariables": {
        "projectTitle": "Project Title",
        "projectAuthor": "Project Author",
        "projectDescription": "Description of project"
      }
    },
    {
      "name": "node-api",
      "description": "Pure Node.js API seed project - No dependencies",
      "customVariables": {
        "projectTitle": "Project Title",
        "projectAuthor": "Project Author",
        "projectDescription": "Description of project"
      }
    },
    {
      "name": "node-express-api",
      "description": "Node.js Express API with full CRUD operations for the first model provided",
      "customVariables": {
        "projectTitle": "Project Title",
        "projectAuthor": "Project Author",
        "projectDescription": "Description of project",
        "firstModel": "First model name camelCase (foo)"
      }
    },
    {
      "name": "angular-material-spa",
      "description": "An Angular Material SPA with navbar",
      "customHelp": "This is some extra help information specific to the angular-material-spa generatable template. Any special instructions should be included here.",
      "customVariables": {
        "projectTitle": "Project Title",
        "projectAuthor": "Project Author",
        "projectDescription": "Description of project"
      }
    }
  ]
}

```

**IMPORTANT: The name of each generatable template project must match the name of the corresponding template meta-data object in the array within the seedProjectsDirectory.json file.**

For the example above:

The **templates** directory should look like this: (The '>' indicates a directory)

```
templates/
   > example
   > node-cli
   > node-api
   > node-express-api
   > angular-material-spa
     seedProjectsDirectory.json
```

#### To point dev-cli generate command to your custom generatable templates directory:

```
dev config generate
```

Enter the path to the directory you want the generate command to use:

Ex. **/Users/someuser/Code/templates/generatables**

#### To check if a custom templates directory is set:

```
dev help config-generate
```

#### To reset the generatable templates directory to the default, internal templates directory:

```
dev config generate reset
```

---

#### Version

Show **dev-cli** current version

```$xslt
dev -v
```

or

```$xslt
dev version
```
