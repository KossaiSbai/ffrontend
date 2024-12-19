# Submission Evaluation App

This is a [Next.js](https://nextjs.org) project for evaluating influencer submissions against creative briefs, using LLMs to provide **structured feedback** with human-in-the-loop enhancements.

---

## Getting Started

To set up the project locally:

### Prerequisites

Create a `.env` file in the root directory with the following variable:

```plaintext
API_URL=http://localhost:3001/api
```

This is the backend API URL required for fetching submissions, briefs, and influencer data. (see the [backend repository]())

---

### Installation

Install the project dependencies:

```bash
npm install
# or
yarn install
```

---

### Running the App

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

---

## How to Use the App

1. **Submission Review Page (/submissions)**:
   - View all submissions and their statuses.
   - Filter submissions by **Influencer** or **Brief**. The filtering happens dynamically as you make a selection.
   - Submissions display:
     - Influencer Name
     - Brief Name
     - Submission Text
     - Status
     - Creation Date
     - Feedback (if available)
   - Feedback and submission text are clearly presented for easy review.

2. **Evaluation Page (/evaluate)**:
   - Assess submissions against a brief using LLM-generated feedback tailored to the submission type (e.g., video topic, script, draft video).
   - The LLM evaluates based on criteria such as alignment with messaging, use of visuals, and clarity of call-to-action.

---

## Process Overview

### **Design Choices**

1. **Why Use LLMs for Submission Evaluation?**  
   - **Alternative Approaches**:
     - **Keyword Analysis**: Detects key terms for compliance but lacks depth.
     - **Rule-Based Systems**: Automates rejection based on predefined criteria (e.g., vulgar content).
     - **Custom Metrics**: Could include weighted scores for compliance.  
   - **Decision**: LLMs provide the most straightforward way to get started, offering detailed, structured output with appropriate prompting.  
   - **Human-in-the-Loop**: Since fully automating evaluations (especially for visuals) is challenging, human review remains crucial for iterative improvements.

2. **Focus on YouTube URLs**:  
   - OneDrive or similar links may not be publicly accessible.  
   - YouTube provides APIs and libraries for accessing metadata like transcripts, making it easier to evaluate submissions.

3. **Brief Processing**:  
   - Briefs can contain sensitive data, images, and videos, but this project focuses on **text-based briefs** to start.  
   - Extracted example briefs (`game design`, `visual creator`) and used these as test data.

---

### **CSV Data Processing**

To prepare the test data, the following Python script was used:

```python
import pandas as pd
import re

file_path = "./milanote-activities.csv"
data = pd.read_csv(file_path)

grouped_conversations = (
    data.groupby(['id', 'campaignId'])
    .agg({
        'message': lambda x: x.dropna(),
        'input': 'first',
        'feedback': 'first'
    })
    .reset_index()
)

# Conversations containing Milanote links
notion_link_conversations = grouped_conversations[
    grouped_conversations['message'].apply(lambda x: any("https://www.notion.so/milanote" in msg for msg in x))
]

# Rejected conversations
rejected_conversations = grouped_conversations[
    grouped_conversations['message'].apply(lambda x: any("reject" in msg.lower() for msg in x))
]

notion_link_conversations.to_csv("notion-link.csv", index=False)
rejected_conversations.to_csv("reject.csv", index=False)
```

**Key Insights**:  
- Conversations were grouped by `id` and `campaignId`.  
- Found Milanote-specific links and extracted rejected conversations for prompt fine-tuning.  
- Used these outputs to refine the LLM prompts.

---

### **Prompt Design**

1. **Data-Driven Approach**:  
   - Manually extracted sample submissions and feedback from the CSV.  
   - Used examples of accepted/rejected feedback for "few-shot prompting."  

2. **Prompt Refinement**:
   - Tailored the prompt based on the **submission type**:
     - Video Topic
     - Draft Script
     - Draft Video  
   - Added **conditional evaluation criteria** (e.g., transcript, description, tags, and comments only if available).  
   - Ensured feedback references specific parts of the submission for clarity.

3. **Feedback Structure**:  
   - Strengths  
   - Corrections Needed  
   - Next Steps

---

## Challenges Faced

1. **Handling Large Briefs**:  
   - Long briefs and multiple submission types required detailed prompt engineering to avoid generic feedback.  
2. **Lack of Visual Content Processing**:  
   - Visual briefs (pictures/videos) could not be automatically parsed, highlighting the need for human-in-the-loop evaluation.  
3. **URL Accessibility**:  
   - YouTube URLs were prioritized due to accessibility via APIs, unlike private drive links.

---

## Future Improvements

- **Video Content Analysis**: Integrate tools to analyze YouTube video content (e.g., detecting visuals, timestamps).
- **Automated Metrics**: Develop custom compliance scores based on specific campaign goals.
- **Better Feedback Visualization**: Use charts or heatmaps to summarize feedback trends for submissions.

---

## Deployment

To deploy the application:

1. Build the app:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

---

## Environment Variables

The app uses the following environment variable:

```plaintext
API_URL=http://localhost:3001/api
```

---
