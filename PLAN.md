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
| `./Developer + Expert Track/Developer Track Instructions/` | `git subtree add --prefix="Developer + Expert Track/Developer Track Instructions" https://github.com/WNCP-AI/skymarket-instructions.git main --squash` |
| `./Developer + Expert Track/Expert Track Instruction/` | `git subtree add --prefix="Developer + Expert Track/Expert Track Instruction" https://github.com/WNCP-AI/skymarket-instructions.git main --squash` |
| `./General Resources/` | `git subtree add --prefix="General Resources" https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git main --squash` |

## Git Subtree Setup Instructions

### Initial Setup
Execute these commands in sequence from the repository root:

```bash
git subtree add --prefix="Beginner Track/Beginner Track Demo Code" https://github.com/WNCP-AI/skymarket-beginner-demo-wncp.git main --squash
git subtree add --prefix="Beginner Track/Beginner Track Instuctions" https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git main --squash
git subtree add --prefix="Developer + Expert Track/Developer + Expert Demo Code" https://github.com/WNCP-AI/skymarket-supabase.git main --squash
git subtree add --prefix="Developer + Expert Track/Developer Track Instructions" https://github.com/WNCP-AI/skymarket-instructions.git main --squash
git subtree add --prefix="Developer + Expert Track/Expert Track Instruction" https://github.com/WNCP-AI/skymarket-instructions.git main --squash
git subtree add --prefix="General Resources" https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git main --squash
```

### Update Commands
Update specific subtrees:

```bash
git subtree pull --prefix="Beginner Track/Beginner Track Instuctions" https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git main --squash
git subtree pull --prefix="Developer + Expert Track/Developer Track Instructions" https://github.com/WNCP-AI/skymarket-instructions.git main --squash
git subtree pull --prefix="Developer + Expert Track/Expert Track Instruction" https://github.com/WNCP-AI/skymarket-instructions.git main --squash
git subtree pull --prefix="General Resources" https://github.com/WNCP-AI/tutorial-wncp-ai-beginner-skymarket.git main --squash
```

## Repository Structure Notes

### Folder Naming Conventions
- Use descriptive names that clearly indicate the content
- Maintain consistency in naming patterns
- Avoid spaces in repository names (use hyphens instead)

### Subtree Path Considerations
- All current subtrees map to the root (`/`) of their respective repositories
- If specific folders within repositories need to be mapped, update the "Subtree Path" column
- Consider using Git subtree with specific paths for large repositories with folder-specific requirements

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
