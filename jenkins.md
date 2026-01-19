# Jenkins Setup Guide - EC2 to GitHub Webhooks

Complete step-by-step guide for setting up Jenkins on AWS EC2 with GitHub webhook integration.

---

## Step 0: AWS EC2 Preparation

### 1. Create EC2 Instance

- **AWS Console** → EC2 → Launch Instance
- **AMI:** Amazon Linux 2023
- **Instance Type:** t3.micro (upgrade to t3.medium for heavy builds)
- **Key Pair:** Create or use existing key (e.g., `SSH-KEY-jenkins`)
- **Storage:** Root volume 16–30GB
- **Security Group:** Open ports
  - SSH → `22`
  - Jenkins → `8080`
- Launch instance

### 2. Connect via SSH

```bash
ssh -i SSH-KEY-jenkins.pem ec2-user@<Public-IP>
```

---

## Step 1: Update & Install Basic Packages

```bash
sudo dnf update -y
sudo dnf install java-17-openjdk-devel git wget -y
java -version
git --version
```

---

## Step 2: Install Jenkins

```bash
# Add Jenkins repository
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key

# Install Jenkins
sudo dnf install jenkins -y
```

---

## Step 3: Enable & Start Jenkins

```bash
sudo systemctl daemon-reload
sudo systemctl enable jenkins
sudo systemctl start jenkins
sudo systemctl status jenkins
```

> **Note:** If `systemctl` fails due to overlay filesystem, run Jenkins directly:
> ```bash
> sudo /usr/bin/jenkins
> ```

---

## Step 4: Configure Swap & Temp Space

### Add Swap (2GB) for Stability

```bash
# Create 2GB swap file
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab

# Verify swap
free -h
```

### Clean Temp Space

```bash
sudo rm -rf /tmp/*
```

---

## Step 5: Open Jenkins Web UI

1. Open browser: `http://<Public-IP>:8080/`
2. Unlock Jenkins using initial admin password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

3. Install **recommended plugins**
4. Create **admin user**

---

## Step 6: Configure Tools in Jenkins

1. Jenkins → **Manage Jenkins** → **Global Tool Configuration**
2. Configure:
   - **Git:** `/usr/bin/git`
   - **Java JDK:** `/usr/lib/jvm/java-17-openjdk`
   - **Maven/Gradle** (optional, if needed)

---

## Step 7: Setup Built-In Node (Executors)

1. Jenkins → **Manage Jenkins** → **Nodes** → **Built-In Node** → **Configure**
2. Set **# of executors = 1–2** (for t3.micro)
3. Click **Mark this node online**

---

## Step 8: Create Your First Pipeline Job

1. Jenkins → **New Item** → **Pipeline** → Enter name → **OK**
2. Under **Pipeline** → **Definition** → **Pipeline script**:

```groovy
pipeline {
    agent any
    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/Rohansmarty/jenkins-sonarcube-docker.git'
            }
        }
        stage('Build') {
            steps {
                echo 'Build stage running...'
            }
        }
    }
}
```

3. **Save**

---

## Step 9: Add GitHub Webhook

### On GitHub:

1. Go to repository → **Settings** → **Webhooks** → **Add webhook**
2. Configure:
   - **Payload URL:** `http://<Public-IP>:8080/github-webhook/`
   - **Content type:** `application/json`
   - **Events:** Select `push` and `pull_request`
3. **Save webhook**

### On Jenkins:

1. Jenkins → **Manage Jenkins** → **Configure System** → **GitHub Servers**
2. Add GitHub server (optional PAT token for private repos)
3. **Test Connection**

---

## Step 10: Test Build

1. Jenkins → Your Pipeline → **Build Now**
2. Check **Console Output**:
   - Workspace creation at `/var/lib/jenkins/workspace/<jobname>`
   - Git clone execution
   - Pipeline stages execution
3. **Test Webhook:** Push a commit to GitHub → Jenkins automatically triggers build

---

## Step 11: Troubleshooting & Maintenance

### Common Issues:

- **Node offline:** 
  - Manage Jenkins → Nodes → Built-In Node → Mark Online
  
- **Memory issues:**
  - Ensure swap is active: `free -h`
  - Check temp space: `df -h /tmp`
  - Free temp space > 500 MB required

- **Build failures:**
  - Check executors: 1–2 for t3.micro
  - Verify Git/Java paths in Global Tool Configuration
  - Review console output for errors

- **Heavy builds (Docker/SonarQube):**
  - Upgrade instance: t3.micro → t3.medium
  - Stop instance → Change instance type → Start instance

---

## Quick Reference: All Commands in Sequence

```bash
# 1. Connect to EC2
ssh -i SSH-KEY-jenkins.pem ec2-user@<Public-IP>

# 2. Update system & install packages
sudo dnf update -y
sudo dnf install java-17-openjdk-devel git wget -y
java -version
git --version

# 3. Install Jenkins
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
sudo dnf install jenkins -y

# 4. Enable & Start Jenkins
sudo systemctl daemon-reload
sudo systemctl enable jenkins
sudo systemctl start jenkins
sudo systemctl status jenkins

# 5. Setup Swap (2GB)
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
free -h

# 6. Clean Temp Space
sudo rm -rf /tmp/*

# 7. Get Jenkins initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

---

## ✅ Expected Results

After completing all steps:

- ✅ Jenkins running on EC2 at `http://<Public-IP>:8080`
- ✅ Public repository cloned successfully
- ✅ Builds trigger automatically via GitHub webhook
- ✅ Swap configured to handle memory spikes
- ✅ Console shows successful build execution
- ✅ Node online and ready for builds

---

## Instance Type Recommendations

| Instance Type | Use Case | Executors |
|--------------|----------|-----------|
| t3.micro | Basic pipelines, small builds | 1-2 |
| t3.medium | Docker builds, SonarQube integration | 2-4 |
| t3.large | Complex multi-stage pipelines | 4-8 |

---

## Security Notes

- Keep security group rules minimal (only required ports)
- Use SSH key pairs, never passwords
- Regularly update Jenkins and plugins
- Consider using HTTPS with reverse proxy for production
- Use GitHub Personal Access Token (PAT) for private repositories

---

## Next Steps

- Configure email notifications for build status
- Set up SonarQube integration for code quality
- Add Docker support for containerized builds
- Configure backup strategy for Jenkins data
- Set up monitoring and alerting
