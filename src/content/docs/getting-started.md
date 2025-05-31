---
title: "Getting Started"
description: "Learn how to get started with Trunk OS"
order: 1
---

# Getting Started with Trunk OS

Welcome to Trunk OS! This guide will help you get up and running with the universal blue-based immutable Linux operating system designed for modern workloads.

## What is Trunk OS?

Trunk OS is an immutable Linux distribution built on uBlue that provides a stable, secure, and modern computing platform with built-in container support and ZFS storage management.

## Key Features

- **Immutable OS**: Atomic updates with rollback capability
- **Container-First**: Native Podman and container workflow support
- **ZFS Storage**: Advanced filesystem with snapshots and compression
- **Web Management**: Browser-based administration panel
- **Secure by Default**: Hardened security configuration
- **uBlue Foundation**: Built on Universal Blue for reliability

## Prerequisites

Before installing Trunk OS, ensure you have:

- [ ] x86_64 compatible hardware
- [ ] Minimum 4GB RAM (8GB recommended)
- [ ] 32GB storage space (64GB+ recommended)
- [ ] UEFI-capable system
- [ ] Network connectivity for initial setup
- [ ] USB drive for installation media (8GB+)

## Installation

### Download Installation Media

```bash
# Download the latest Trunk OS ISO
curl -LO https://github.com/trunk-os/trunk-os/releases/latest/download/trunk-os.iso

# Verify the download (optional)
curl -LO https://github.com/trunk-os/trunk-os/releases/latest/download/trunk-os.iso.sha256
sha256sum -c trunk-os.iso.sha256
```

### Create Installation Media

**Linux/macOS:**
```bash
# Replace /dev/sdX with your USB device
sudo dd if=trunk-os.iso of=/dev/sdX bs=4M status=progress
```

**Windows:**
Use [Rufus](https://rufus.ie/) or [Balena Etcher](https://www.balena.io/etcher/) to flash the ISO to your USB drive.

### Install Trunk OS

1. **Boot from USB**: Configure your system to boot from the USB drive
2. **Run Installer**: Follow the graphical installer prompts
3. **Configure Storage**: Set up ZFS pools and datasets as needed
4. **Create User Account**: Set up your initial user account
5. **Complete Installation**: Reboot and remove installation media

## Initial Setup

### First Boot

1. **Login**: Use the account created during installation
2. **Update System**: Ensure you have the latest updates
   ```bash
   rpm-ostree upgrade
   systemctl reboot
   ```

3. **Configure Network**: Set up networking if not done during installation
4. **Enable Services**: Start essential services
   ```bash
   sudo systemctl enable --now podman
   sudo systemctl enable --now gild  # Management API
   ```

## First Steps

### 1. System Status

Check your system status:
```bash
# View system information
neofetch

# Check ZFS pools
sudo zpool status

# View running containers
podman ps
```

### 2. Container Management

Deploy your first container:
```bash
# Run a simple web server
podman run -d --name nginx -p 8080:80 nginx:alpine

# Check it's running
curl http://localhost:8080
```

### 3. Web Management Panel

Access the web management interface:
1. Open browser to `http://localhost:5300`
2. Create your first admin user
3. Explore ZFS management and system monitoring

### 4. ZFS Storage

Create your first dataset:
```bash
# Via command line
sudo zfs create tank/data

# Or via web panel: Storage > Datasets > Create
```

## Configuration

### Package Management

Install additional software using containers or Flatpaks:
```bash
# Install applications via Flatpak
flatpak install flathub com.visualstudio.code

# Use toolbox for development
toolbox create
toolbox enter
```

### System Configuration

Layer additional packages if needed:
```bash
# Install system packages (requires reboot)
rpm-ostree install htop

# Apply changes
systemctl reboot
```

### Storage Configuration

Configure additional ZFS features:
```bash
# Enable compression
sudo zfs set compression=lz4 tank

# Create snapshots
sudo zfs snapshot tank@backup-$(date +%Y%m%d)

# List snapshots
sudo zfs list -t snapshot
```

## Essential Commands

### System Management
```bash
# Check system status
rpm-ostree status

# Rollback to previous version
rpm-ostree rollback

# View system logs
journalctl -f
```

### Container Management
```bash
# List containers
podman ps -a

# View container logs
podman logs <container-name>

# Stop/start containers
podman stop <container-name>
podman start <container-name>
```

### ZFS Management
```bash
# Check pool health
sudo zpool status

# View dataset usage
sudo zfs list

# Create snapshot
sudo zfs snapshot tank/data@backup
```

## Next Steps

1. **Explore Containers**: Learn Podman and container workflows
2. **Set up Development**: Configure toolbox environments
3. **Configure Storage**: Set up automated snapshots and backups
4. **Web Panel**: Familiarize yourself with the management interface
5. **Security**: Review and customize security settings

## Troubleshooting

### Common Issues

**Boot Issues:**
- Check UEFI settings and secure boot configuration
- Verify installation media integrity

**Container Issues:**
- Check SELinux contexts: `sudo setsebool -P container_manage_cgroup on`
- Verify Podman configuration: `podman info`

**ZFS Issues:**
- Check pool status: `sudo zpool status`
- Review ZFS events: `sudo zpool events`

### Getting Help

If you need assistance:

- Check the [API Reference](api-reference) for automation
- Join our [Community Forum](https://community.trunk-os.io)
- Open an issue on [GitHub](https://github.com/trunk-os/trunk-os)
- Consult the [Universal Blue documentation](https://universal-blue.org/)

## Additional Resources

- **Container Guide**: Learn advanced Podman usage
- **ZFS Guide**: Master ZFS administration
- **Security Guide**: Harden your system
- **Development Guide**: Set up development environments