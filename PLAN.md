# V313 2025 AI Buildathon Learning Hub - Repository Mapping Plan

## Overview
This document outlines the Git repository mapping strategy for the V313 2025 AI Buildathon Learning Hub. Each folder will be mapped to its corresponding Git repository using Git subtrees for efficient version control and collaboration.

## Repository Mapping Table

| Path | Name | Description | Git Repository | Subtree Path |
|------|------|-------------|----------------|--------------|
| `./Beginner Track/Beginner Track Demo Code/` | Beginner Demo Code | Demo code examples and starter templates for beginner track participants | `https://github.com/WNCP-AI/skymarket-beginner-demo-wncp.git` | `/` |
| `./Beginner Track/Beginner Track Instuctions/` | Beginner Instructions | Step-by-step instructions and tutorials for beginner track - SkyMarket drone marketplace tutorial | `https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git` | `/` |
| `./Developer + Expert Track/Developer + Expert Demo Code/` | Advanced Demo Code | Advanced demo code and examples for developer and expert tracks | `https://github.com/WNCP-AI/skymarket-supabase.git` | `/` |
| `./Developer + Expert Track/Developer Track Instructions/` | Developer Instructions | Technical instructions and guidelines for developer track | `https://github.com/WNCP-AI/skymarket-instructions.git` | `/tracks/developer` |
| `./Developer + Expert Track/Expert Track Instruction/` | Expert Instructions | Expert-level instructions and advanced topics | `https://github.com/WNCP-AI/skymarket-instructions.git` | `/tracks/expert` |
| `./General Resources/` | General Resources | Shared resources, documentation, and common assets | `https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git` | `/resources` |

## Git Subtree Setup Commands

| Path | Git Subtree Add Command |
|------|------------------------|
| `./Beginner Track/Beginner Track Demo Code/` | `git subtree add --prefix="Beginner Track/Beginner Track Demo Code" https://github.com/WNCP-AI/skymarket-beginner-demo-wncp.git main --squash` |
| `./Beginner Track/Beginner Track Instuctions/` | `git subtree add --prefix="Beginner Track/Beginner Track Instuctions" https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git main --squash` |
| `./Developer + Expert Track/Developer + Expert Demo Code/` | `git subtree add --prefix="Developer + Expert Track/Developer + Expert Demo Code" https://github.com/WNCP-AI/skymarket-supabase.git main --squash` |
| `./Developer + Expert Track/Developer Track Instructions/` | see split-based subpath import below |
| `./Developer + Expert Track/Expert Track Instruction/` | see split-based subpath import below |
| `./General Resources/` | see split-based subpath import below |

## Git Subtree Setup Instructions

### Initial Setup (root-mapped subtrees)
Execute these commands in sequence from the repository root:

```bash
git subtree add --prefix="Beginner Track/Beginner Track Demo Code" https://github.com/WNCP-AI/skymarket-beginner-demo-wncp.git main --squash
git subtree add --prefix="Beginner Track/Beginner Track Instuctions" https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git main --squash
git subtree add --prefix="Developer + Expert Track/Developer + Expert Demo Code" https://github.com/WNCP-AI/skymarket-supabase.git main --squash
# Note: The following three require subpath imports (see next section):
# - Developer + Expert Track/Developer Track Instructions  (tracks/developer)
# - Developer + Expert Track/Expert Track Instruction      (tracks/expert)
# - General Resources                                      (resources)
```

### Split-based subpath imports (recommended)
Some upstream repositories need only a specific subfolder (subpath). Since `git subtree` cannot directly import a remote subdirectory, use a temporary local clone to create a split branch for the subpath, then add that split as a subtree.

Run from repository root. The `.tmp/` folder can be ignored/removed anytime.

```bash
# 1) Developer Track Instructions (from skymarket-instructions: tracks/developer)
mkdir -p .tmp && cd .tmp
if [ ! -d skymarket-instructions ]; then \
  git clone --depth=1 --no-tags https://github.com/WNCP-AI/skymarket-instructions.git skymarket-instructions; \
fi
cd skymarket-instructions
git subtree split --prefix=tracks/developer -b split-developer
cd ../..
git subtree add --prefix="Developer + Expert Track/Developer Track Instructions" \
  ./.tmp/skymarket-instructions split-developer --squash

# 2) Expert Track Instruction (from skymarket-instructions: tracks/expert)
cd .tmp/skymarket-instructions
git subtree split --prefix=tracks/expert -b split-expert
cd ../..
git subtree add --prefix="Developer + Expert Track/Expert Track Instruction" \
  ./.tmp/skymarket-instructions split-expert --squash

# 3) General Resources (from tutorial-wncp-ai-beginner-skymarket: resources)
cd .tmp
if [ ! -d tutorial-wncp-ai-beginner-skymarket ]; then \
  git clone --depth=1 --no-tags https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git tutorial-wncp-ai-beginner-skymarket; \
fi
cd tutorial-wncp-ai-beginner-skymarket
git subtree split --prefix=resources -b split-resources
cd ../..
git subtree add --prefix="General Resources" \
  ./.tmp/tutorial-wncp-ai-beginner-skymarket split-resources --squash
```

### Update Commands
Update specific subtrees:

```bash
# Root-mapped subtrees:
git subtree pull --prefix="Beginner Track/Beginner Track Instuctions" \
  https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git main --squash

# Subpath-mapped subtrees (recreate local splits, then pull):
# Developer Track Instructions
cd .tmp/skymarket-instructions && git fetch --depth=1 origin main && \
  git checkout main && git reset --hard origin/main && \
  git branch -D split-developer 2>/dev/null || true && \
  git subtree split --prefix=tracks/developer -b split-developer && cd ../..
git subtree pull --prefix="Developer + Expert Track/Developer Track Instructions" \
  ./.tmp/skymarket-instructions split-developer --squash

# Expert Track Instruction
cd .tmp/skymarket-instructions && git fetch --depth=1 origin main && \
  git checkout main && git reset --hard origin/main && \
  git branch -D split-expert 2>/dev/null || true && \
  git subtree split --prefix=tracks/expert -b split-expert && cd ../..
git subtree pull --prefix="Developer + Expert Track/Expert Track Instruction" \
  ./.tmp/skymarket-instructions split-expert --squash

# General Resources
cd .tmp/tutorial-wncp-ai-beginner-skymarket && git fetch --depth=1 origin main && \
  git checkout main && git reset --hard origin/main && \
  git branch -D split-resources 2>/dev/null || true && \
  git subtree split --prefix=resources -b split-resources && cd ../..
git subtree pull --prefix="General Resources" \
  ./.tmp/tutorial-wncp-ai-beginner-skymarket split-resources --squash
```

## Repository Structure Notes

### Folder Naming Conventions
- Use descriptive names that clearly indicate the content
- Maintain consistency in naming patterns
- Avoid spaces in repository names (use hyphens instead)

### Subtree Path Considerations
- Some subtrees map to the root (`/`) of their repositories (Beginner Demo Code, Advanced Demo Code)
- Others intentionally map to specific subfolders via split-based imports:
  - `skymarket-instructions` → `/tracks/developer` and `/tracks/expert`
  - `tutorial-wncp-ai-beginner-skymarket` → `/resources`
- Use the split-based workflow above to add or update subpath-mapped subtrees reliably

### Repository Organization
- **Resources Management**: The `resources/` folder is managed as a separate subtree in `./General Resources/` for better organization
- **Shared Instructions Repository**: Both Developer and Expert track instructions come from the same repository but different subdirectories (`/tracks/developer` and `/tracks/expert`)
- **SkyMarket Focus**: Multiple repositories centered around the SkyMarket project for the V313 AI Buildathon

### Maintenance Guidelines
1. **Regular Updates**: Schedule regular subtree pulls to keep content current
2. **Version Control**: Use `--squash` flag to maintain clean history
3. **Documentation**: Keep this plan updated when adding new tracks or resources
4. **Testing**: Test subtree setup after any structural changes
5. **Bidirectional Sync**: Use `git subtree push` to contribute changes back to source repositories

## Next Steps

1. **Create Repositories**: Set up the individual Git repositories listed in the table
2. **Initialize Subtrees**: Add each repository as a subtree using the commands from the setup table
3. **Content Migration**: Move existing content to appropriate repositories
4. **Documentation**: Update individual repository documentation
5. **CI/CD Setup**: Configure automated workflows for subtree management

## Troubleshooting

### Common Issues
- **Subtree conflicts**: Use `--squash` flag to avoid merge conflicts
- **Permission errors**: Ensure proper SSH keys or access tokens are configured
- **Path conflicts**: Verify folder paths don't conflict with existing files
- **History pollution**: Always use `--squash` to keep main repository history clean

### Support
For issues with subtree setup or repository management, refer to:
- [Git Subtree Documentation](https://git-scm.com/docs/git-subtree)
- [Git Subtree Tutorial](https://www.atlassian.com/git/tutorials/git-subtree)

---

*Last Updated: $(date)*
*Version: 1.0*
