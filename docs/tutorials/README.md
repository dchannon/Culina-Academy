# Video Tutorials

This hub connects Data Culina YouTube tutorials to the public framework documentation. Videos provide the guided explanation; the linked docs remain the detailed operating reference.

## Published Tutorials

### 01. Data Culina Framework Fundamentals Episode 01

[![Watch Data Culina Framework Fundamentals Episode 01 on YouTube](https://img.youtube.com/vi/zpb9Vy29kMI/maxresdefault.jpg)](https://youtu.be/zpb9Vy29kMI)

**Watch:** [Data Culina Framework Fundamentals Episode 01](https://youtu.be/zpb9Vy29kMI)  
**Duration:** 6:39  
**Audience:** Clients, users, operators, and implementation partners  
**Outcome:** Understand the fundamental idea behind the Data Culina framework and how shared framework patterns turn context into repeatable work.  
**Prerequisites:** None

#### Companion Docs

- [What Is Culina?](../getting-started/what-is-culina.md)
- [Framework Overview](../getting-started/framework-overview.md)
- [Framework Architecture](../architecture/framework-architecture.md)

#### After Watching

Use the [Quickstart](../getting-started/quickstart.md) to trace one configured workflow through the control plane.

Use the [video entry template](video-entry-template.md) for future tutorials so every entry has consistent metadata, chapters, companion docs, and a transcript.

## Suggested Series

| Order | Tutorial | Learning outcome | Companion docs |
| ---: | --- | --- | --- |
| 1 | Culina Framework Overview | Explain the framework purpose and operating model. | [What Is Culina?](../getting-started/what-is-culina.md) |
| 2 | Control Plane Structure | Trace jobs, sources, transformations, dependencies, and runtime evidence. | [Control Plane](../architecture/control-plane.md) |
| 3 | Orchestration Plane | Understand planning, dependency readiness, dispatch, monitoring, and finalization. | [Orchestration Plane](../architecture/orchestration-plane.md) |
| 4 | Data Layers | Follow data from source through landing, staging, integration, EDW, and consumption. | [Data Layers](../architecture/data-layers.md) |
| 5 | Trace A Sandbox Workflow | Follow one configured ingestion job into downstream modeled work. | [Quickstart](../getting-started/quickstart.md) |
| 6 | Configure Ingestion | Create and review a REST ingestion pattern. | [Add REST Ingestion](../guides/add-rest-ingestion.md) |
| 7 | Configure Transformation | Create sources, steps, targets, keys, and validation. | [Add Transformation](../guides/add-transformation.md) |
| 8 | Diagnose And Recover | Find the earliest failure and choose a narrow recovery scope. | [Engine Diagnostics](../troubleshooting/engine-diagnostics.md) |

## Publishing Workflow

1. Upload the final video to the Data Culina YouTube channel.
2. Keep it unlisted during review, then make it public when approved.
3. Add captions and chapters in YouTube.
4. Copy the [video entry template](video-entry-template.md) into this page.
5. Replace every placeholder with the final title, video id, duration, audience, and links.
6. Add a transcript under [`transcripts/`](transcripts/README.md).
7. Test the video and thumbnail while signed out of YouTube.
8. Link the tutorial from its companion documentation page where useful.

## Standards

- Use H.264 video and clear 16:9 thumbnails.
- Keep titles task-oriented and understandable without internal context.
- Never show credentials, private endpoints, client data, or unapproved configuration.
- Include captions, a written transcript, chapters, prerequisites, and a next action.
- Update the tutorial entry when framework behavior or companion docs change.
