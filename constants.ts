import { ResumeData } from './types';

export const RESUME_DATA: ResumeData = {
  personalInfo: {
    name: "NIKHIL A M",
    role: "DevOps Engineer",
    email: "nikhilam.nn@gmail.com",
    phone: "+91 8970906300",
    linkedin: "linkedin.com/in/nikhil-am",
    location: "Bangalore, India",
    status: "Open to opportunities and collaborations where my skill sets are best utilized",
    languages: ["English (Fluent)", "Hindi (Native)", "Kannada (Native)"],
    avatar: "https://github.com/nikhil1697.png"
  },
  summary: "Results-driven DevOps Engineer with 7+ years of hands-on experience designing, implementing, and maintaining production-grade Kubernetes clusters and enterprise cloud infrastructure. Proven expertise in infrastructure automation, CI/CD pipeline orchestration, disaster recovery, and high-availability systems. Strong background in SRE principles including incident management, SLO/SLA definition, and root cause analysis. Skilled in cloud-native technologies (AWS, Terraform, Docker, Helm), configuration management (Ansible), and observability (Prometheus, Grafana). Passionate about automation, infrastructure-as-code, and reliability engineering.",
  skills: [
    {
      category: "Cloud & Virtualization",
      skills: ["AWS (EC2, S3, VPC, RDS, IAM, EKS)", "OpenStack", "GlusterFS", "CloudFormation", "Auto Scaling"]
    },
    {
      category: "Orchestration & Containers",
      skills: ["Kubernetes (CKA/CKAD)", "OpenShift", "Helm Charts", "ArgoCD", "Docker", "Containerd", "Istio Service Mesh"]
    },
    {
      category: "IaC & Configuration",
      skills: ["Terraform", "Ansible", "YAML", "Jinja2"]
    },
    {
      category: "CI/CD & DevOps Tools",
      skills: ["Jenkins", "GitLab CI/CD", "GitHub Actions", "SonarQube", "JFrog Artifactory", "Nexus"]
    },
    {
      category: "Observability & Logging",
      skills: ["Prometheus", "Grafana", "AlertManager"]
    },
    {
      category: "Scripting & Development",
      skills: ["Python", "Bash/Shell Scripting", "Groovy", "JSON", "REST APIs", "Git"]
    },
    {
      category: "Security & Networking",
      skills: ["HashiCorp Vault", "Nginx", "HAProxy", "Calico", "Cert-Manager", "Ingress Controllers", "Network Policies"]
    }
  ],
  experience: [
    {
      company: "Netcracker Technology India Pvt Ltd",
      location: "Bangalore, India",
      role: "DevOps Engineer",
      period: "05/2022 – Present",
      description: [
        "Maintain and monitor multiple Kubernetes clusters and Openshift cluster across diverse environments, ensuring high availability and high performance.",
        "Written python scripts and codes to enhance the kubemarine functionality and contributed to the opensource project of it.",
        "Lead cluster upgrade efforts, successfully migrating Kubernetes to newer stable versions with minimal downtime.",
        "Configured and built Jenkins servers to implement CI-CD.",
        "Spearheaded OS migration from CentOS to Ubuntu, ensuring platform compatibility and security hardening.",
        "Written shell scripts and python scripts to automate manual and repetitive tasks.",
        "Added support for new Kubernetes versions within the internal Kubemarine automation framework, improving deployment flexibility.",
        "Experience working with CI/CD implementation of Microservice based Architecture.",
        "Maintain and organize required container images, Helm charts, and configuration files in internal repositories (artifactory, Nexus, etc.).",
        "Conduct compatibility certification for new Linux OS versions, ensuring tool and product operability across environments.",
        "Provide both R&D and L3 support for DevOps toolsets: Kubemarine, OpenShift Installer, Cert-Manager, and DR Navigator.",
        "Build and maintain CI/CD pipelines using Jenkins, GitLab CI, and ArgoCD to automate testing, deployment, and monitoring."
      ]
    },
    {
      company: "Mobitech Creations Private Limited (Oneplus)",
      location: "Bangalore, India",
      role: "Cloud Management executive",
      period: "07/2018 – 12/2021",
      description: [
        "Oversaw cloud infrastructure operations, focusing on server uptime, monitoring, and scaling.",
        "Managed internal tools and platforms on OPSS and SCM, supporting global product deployments.",
        "Developed automation scripts for provisioning, backups, and system maintenance.",
        "Monitored application performance and logs, proactively addressing production issues.",
        "Worked closely with the DevOps team to introduce Kubernetes-based container environments.",
        "Worked on branching and merging. Creating branches for different teams and for different projects. Merging branches periodically and according to requests from dev teams.",
        "Setting up Jenkins jobs and adding plugins when required for automation.",
        "Working in shifts to resolve tickets from different customer production issues.",
        "Managing build infrastructures environment setups and monitoring daily operations in Jenkins and enhancing/troubleshoot issues/problems.",
        "Worked on Ansible. I have written playbooks to deploy builds to multiple servers."
      ]
    }
  ],
  projects: [
    {
      name: "KubeMarine",
      role: "DevOps Engineer",
      type: "Open Source & Enterprise",
      link: "https://github.com/Netcracker/KubeMarine/pulls?q=is%3Apr+author%3Anikhil1697+is%3Aclosed",
      techStack: ["Python", "Go", "Jinja", "Shell", "CSS", "DockerFile", "YAML"],
      description: [
        "Integrating new k8s version with kubemarine.",
        "Integrating new Linux OS support.",
        "Providing R&D level contribution and support for customer facing production clusters.",
        "Team Size: 14"
      ]
    },
    {
      name: "OpenShift Installer",
      role: "DevOps Engineer",
      type: "Enterprise Automation",
      techStack: ["Shell", "Jinja", "Python", "Groovy"],
      description: [
        "Trouble shooting production level issue with glusterfs and fixing them.",
        "Working on adding nodes, maintaining nodes, scaling.",
        "Team Size: 8"
      ]
    },
    {
      name: "DR Navigator",
      role: "DevOps Engineer",
      type: "Disaster Recovery",
      techStack: ["Shell", "Jinja", "Python", "Go"],
      description: [
        "Building and extending Kubernetes-based DR validation test suites.",
        "Automating multi-cluster HA testing with real-time observability integration.",
        "Ensuring recovery policies match enterprise SLAs for OpenShift and upstream Kubernetes.",
        "Team Size: 8"
      ]
    },
    {
      name: "Cert-manager",
      role: "DevOps Engineer",
      type: "Kubernetes Tooling",
      techStack: ["Shell", "Mustache"],
      description: [
        "Adding support for new certificate issuers and extending issuer backends.",
        "Building and maintaining Helm charts for secure, production-grade deployments.",
        "Contributing to the webhook validation and CRD upgrade processes.",
        "Team Size: 6"
      ]
    }
  ],
  metrics: [
    { label: "Uptime", value: 99.9, suffix: "%", description: "Cluster Availability", color: "#4ade80" },
    { label: "MTTR", value: 30, suffix: "m", description: "Mean Time To Resolve", color: "#facc15" },
    { label: "Cycle Time", value: 30, suffix: "%", description: "Faster Deployment", color: "#60a5fa" },
    { label: "Overhead", value: 40, suffix: "%", description: "Reduced Ops Work", color: "#f472b6" },
    { label: "IaC Coverage", value: 95, suffix: "%", description: "Infra Automation", color: "#a78bfa" },
    { label: "Success Rate", value: 99.8, suffix: "%", description: "Pipeline Reliability", color: "#2dd4bf" }
  ],
  education: {
    degree: "Bachelor of Engineering (BE)",
    institution: "Adichunchanagiri Institute of Technology, Bangalore",
    year: "June 2018"
  },
  certifications: [
    "Kubernetes Administration",
    "CI/CD Pipeline Design & Implementation",
    "Terraform & Infrastructure-as-Code",
    "SRE Principles & Incident Management",
    "Container Security & Best Practices",
    "AWS Cloud Fundamentals",
    "Advanced Linux System Administration"
  ]
};