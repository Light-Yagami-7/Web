#!/bin/bash

# Define variables
GITHUB_REPO="https://github.com/Light-Yagami-7/Web.git"
CONFIG_DIR="$HOME/.config"  # User's config directory
PACKAGES="waybar"  # Add other packages you want to install here


# Clone the GitHub repo containing your new config files from the master branch
echo "Cloning config files from GitHub (master branch)..."
git clone --branch master --single-branch "$GITHUB_REPO" "$CONFIG_DIR/your-config-repo"

# Replace current config files with the ones from the GitHub repo
echo "Replacing current config files with the ones from GitHub..."
cp -r "$CONFIG_DIR/your-config-repo"/* "$CONFIG_DIR/"

# Install necessary packages (like Waybar)
echo "Installing packages: $PACKAGES..."
sudo pacman -Syu --noconfirm $PACKAGES

# Clean up
echo "Cleaning up temporary files..."
rm -rf "$CONFIG_DIR/your-config-repo"

echo "Done! Your config files have been replaced and the necessary packages installed."

echo "Everything is almost done now setting up the lock manger..."
sh -c "$(curl -fsSL https://raw.githubusercontent.com/keyitdev/sddm-astronaut-theme/master/setup.sh)"
