[tags]:        https://github.com/srealmoreno/label-sync-action/tags
[wiki]:        https://github.com/srealmoreno/label-sync-action/wiki
[contributors]:https://github.com/srealmoreno/label-sync-action/graphs/contributors
[Personal Access Token]: https://github.com/settings/tokens/new

# Label Sync Action [![Codacy Badge](https://app.codacy.com/project/badge/Grade/2e47ea97e1e546afab645674825e0122)](https://www.codacy.com/gh/srealmoreno/label-sync-action/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=srealmoreno/label-sync-action&amp;utm_campaign=Badge_Grade)

Label Sync Action is a simple action that syncs labels to a GitHub repository or
list of repositories.

Manage all tags from all your repositories in a single place.

## 🚀 Getting Started

### Create a config file 📝

The default file path is `.github/labels.yml`, but you can specify a different path
see options below.

How to create a config file:

- Create a JSON or YAML file, with one of these extensions: `.json`, `.jsonc`, `.yaml`,
  `.yml`.
- Every label should be an array element: add some square brackets `[]` if you need
  to.
- Every element of the array should be an object with the following properties:
  - `name` - The name of the label.
  - `color` - The color of the label.
  - `description` - [optional] The description of the label.
  - `aliases` - [optional] An array containing the "aliases" of the label. If an
    existing label's name is an alias that label will be edited to match your config:
    this way you don't loose issues and PRs that have been labeled previously.

```yaml
- name: breaking-change 💥
  color: '#D93F0B'
  description:
    A change that changes the API or breaks backward compatibility for
    users.
  aliases: [breaking]

- name: bug 🐞
  color: d73a4a
  description: 
    Inconsistencies or issues which will cause a problem for users or implementors.

- name: documentation 📝
  color: 0075ca
  description: Solely about the documentation of the project.
```

> The `#` in color it's optional.

```jsonc
[
  // Support comments
  {
    // My label
    "name": "breaking-change 💥",
    "color": "#D93F0B",
    "description": 
      "A change that changes the API or breaks backward compatibility for users.",
    "aliases": [
      "breaking"
    ]
  },
  {
    "name": "bug 🐞",
    "color": "d73a4a",
    "description": 
      "Inconsistencies or issues which will cause a problem for users or implementors."
  },
  {
    "name": "documentation 📝",
    "color": "0075ca",
    "description": "Solely about the documentation of the project."
  }
]
```

> The `#` in color it's optional.

### Create a workflow 📝

Sample basic workflow:

```yaml
name: ♻️ Sync Labels

on:
  workflow_dispatch:

jobs:
  labels:
    name: ♻️ Sync labels
    runs-on: ubuntu-20.04
    steps:
      - name: ⤵️ Check out code from GitHub
        uses: actions/checkout@v3

      - name: 🚀 Run Label Sync
        uses: srealmoreno/label-sync-action@v1
```

## 📋 Usage

### Sync labels to a list of repositories 📦

Specify a repository or a list of repositories

```yaml
- name: 🚀 Run Label Sync
  uses: srealmoreno/label-sync-action@v1
  with:
    token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
    
    # Optional:
    repositories: |
      owner/repository-1
      owner/repository-2
    
    # Optional:
    config-file: |
      .github/labels-1.yml
      .github/labels-2.yml
      https://raw.githubusercontent.com/srealmoreno/label-sync-action/main/.github/labels/labels.yml
    
    # Optional:
    # Clean other labels not defined in the config file(s)
    clean-labels: false
```

> Note: The default `GITHUB_TOKEN` will not have permissions to
> write labels on other repositories so you must specify a [Personal Access Token]
> with access to repositories.

### Get Labels of url 🔗

It's possible to get the labels of url.
If you use only url, the `actions/checkout@v3` step is not necessary

```yaml
steps:
  - name: 🚀 Run Label Sync
    uses: srealmoreno/label-sync-action@v1
    with:
      config-file: https://raw.githubusercontent.com/srealmoreno/label-sync-action/main/.github/labels/labels.yml
```

### Auto Discover Repositories 🔍

If you have a very large list of repositories and you want to have the same
tags in all repositories you can use the `auto-discover-repos` option.

```yaml
- name: 🚀 Run Label Sync
  uses: srealmoreno/label-sync-action@v1
  with:
    token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
    auto-discover-repos: true

    # Optional:
    exclude-repos: repo-1
    # You can specify a array of the repositories to be excluded
    exclude-repos: |
      repository-1
      repository-2
    # You can specify regex to exclude repositories
    exclude-repos: /^repository-1$/u

    # Optional:
    account-type: org | user

    # Optional:
    owner: owner

    # Optional:
    exclude-forked-repos: true

    # Optional:
    exclude-archived-repos: true

    # Optional:
    exclude-private-repos: true

    # Optional:
    exclude-disabled-repos: true
```

## 🛠️ Built With

- [Node.js](https://nodejs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Esbuild]([https://esbuild.org)

## 🖇️ Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md)for details on our code of conduct,
and the process for submitting pull requests to us.

## 📖 Wiki

You can find more information about this project on the [wiki][wiki].

## 📌 Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available,
see the [tags on this repository][tags].

## ✒️ Authors

- **Srealmoreno** - *Initial work* - [srealmoreno](https://github.com/srealmoreno)

See also the list of [contributors][contributors] who participated in this project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](../LICENSE.md)
file for details

## 🎁 Acknowledgments

- Inspiration [EndBug/label-sync](https://github.com/EndBug/label-sync)
- Templates [Z-shell](https://github.com/z-shell)
