# curiosityReport.md

## 🧠 Topic: How Netflix Does DevOps

So, for my curiosity deep dive, I decided to learn more about how Netflix handles DevOps. I’ve always been kind of fascinated by big tech infrastructure, and Netflix is one of those companies that everyone knows has crazy scale. I wanted to understand what makes their DevOps setup so reliable—like, how do they keep everything running 24/7 with millions of users streaming at once?

---

## 🌍 What I Researched

### 1. **Microservices Everywhere**
Netflix was one of the first big companies to really go all-in on microservices. Instead of having one giant monolithic app, they split their app into tons of smaller services that all communicate through APIs. This helps them deploy changes to one part of the system without affecting the rest, which is super important at their scale.

### 2. **Chaos Engineering**
This is wild—they literally *intentionally break things* in production using a tool they made called **Chaos Monkey**. The whole idea is that by constantly testing failure, they can make sure their systems are resilient and don’t crash if something unexpected goes down. It’s like stress-testing your app in real life.

### 3. **CI/CD Pipeline**
They’ve built a custom deployment pipeline that supports rapid CI/CD. Engineers can push code multiple times a day with confidence. They use Spinnaker (an open-source, multi-cloud CD platform they actually helped build), and it gives them full control over deployment strategies like blue-green, canary releases, etc.

### 4. **Observability is Key**
Netflix invests a ton in monitoring. They use tools like **Atlas** (their own metrics platform) and **EDDA** (for cloud change tracking). Their whole system is built around being able to detect and respond to issues fast. If a microservice is acting weird, they want to know *immediately*.

### 5. **Culture of Freedom & Responsibility**
I also read that Netflix gives their engineers a lot of freedom—like, they can deploy their own services and pick the tech stack that works best for them—but that also comes with the responsibility of owning the uptime and performance of whatever they build. It’s kind of a DevOps mindset baked into the company culture.

---

## 🔍 Why This Mattered to Me

The more I read about Netflix’s DevOps strategy, the more I realized how important automation, resilience, and observability are. It made me think differently about the stuff we’ve been doing with CI/CD and testing. Like, it’s not just about writing tests or pushing code—it’s about building systems that *can handle chaos* and scale without breaking down.

It also made me want to play around with some of their open source tools, especially Spinnaker and Chaos Monkey. I think experimenting with those would be a cool way to get more hands-on experience with real-world DevOps practices.

---

## ✅ TL;DR

Netflix does DevOps at a whole different level:
- Microservices everywhere
- Chaos Monkey breaks stuff on purpose
- Super fast and safe deployments with Spinnaker
- Huge investment in observability
- Engineers own their code *and* its uptime

Honestly, this whole deep dive made me more curious about site reliability engineering (SRE), so that might be my next rabbit hole.
