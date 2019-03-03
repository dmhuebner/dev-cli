# dev-cli
Development CLI made with Node.js that includes tools created to help improve development efficiency.

##### To Install:
Clone this Repo and cd into it to install:

```$xslt
npm i -g .
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

Generator Template projects are boiler plate projects that include custom variables delimited with **{% %}** for example, **{%someCustomVar%}**.

To Create a Generator Template, create a base project that you want to be able to generate, and replace file names and file content with as many custom variables (delimited with **{% %}**) as needed.

##### Variable Casing

You can also specify **casing** for any custom variables such as model names that may need to be in several cases throughout your project. You specify casing in your template projects by adding a case (in camelCase) inside **[ ]** brackets at the end of the variable. See example below:

Ex) If you have a model in a file that you want to be represented with a custom variable {%firstModel%} with a value of 'fooBar', you may have a need to express that variable value in camelCase, as well as capitalized, and in kebab-case.

**capitalized** 

You can add a capitalized permutation of **{%firstModel%}** within the template project like this: **{%firstModel[capitalized]%}** which would result in a value of 'FooBar'.

**kebabCase**

You can add a a kebab-case permutation of **{%firstModel%}** within the template project like this: **{%firstModel[kebabCase]%}** which would result in a value of 'foo-bar'.

##### New Template Projects must be added to the "templates" directory within the dev-cli project.

##### New Template Projects meta-data must be added to the seedProjectsDirectory.json file in the "templates" directory.

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
