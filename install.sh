#!/bin/bash

# Define variables
GITHUB_REPO="https://github.com/Light-Yagami-7/Web.git"
CONFIG_DIR="$HOME/.config"
REPO_DIR="$CONFIG_DIR/your-config-repo"
PACKAGES="waybar swaybg alacritty yazi zoxide neovim"

# Clone GitHub repo
echo "Cloning config files from GitHub..."
git clone --branch master --single-branch "$GITHUB_REPO" "$REPO_DIR" || { echo "Failed to clone repo. Exiting."; exit 1; }

# Copy .zshrc before polluting the repo into .config
cp "$REPO_DIR/.zshrc" ~/.zshrc

# Copy configs
echo "Replacing configs..."
cp -r "$REPO_DIR"/* "$CONFIG_DIR/"

# Install packages
echo "Installing packages: $PACKAGES..."
sudo pacman -Syu --noconfirm $PACKAGES

# Install atuin if yay exists
if command -v yay >/dev/null 2>&1; then
    echo "Installing atuin..."
    yay -S --noconfirm atuin
    atuin init
else
    echo "⚠️ yay not found, skipping atuin install."
fi

# Lock screen setup
echo "Setting up SDDM lockscreen theme..."
sh -c "$(curl -fsSL https://raw.githubusercontent.com/keyitdev/sddm-astronaut-theme/master/setup.sh)"

# Install Zsh and oh-my-zsh at the very end
echo "Installing Zsh + oh-my-zsh..."
sudo pacman -S --noconfirm zsh git

git clone https://github.com/ohmyzsh/ohmyzsh.git ~/.oh-my-zsh
chsh -s "$(which zsh)"

# Clean up
echo "Cleaning up..."
rm -rf "$REPO_DIR"

echo "✅ Done. Reboot or relog to start using Zsh!"
