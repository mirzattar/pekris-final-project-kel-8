# Project Plan: Lost & Found Website

## 1. Background

Students often lose their stuff: a tumbler left in A206, a laptop charger gone missing in the student lounge, or a student card (KTM) left somewhere. Looking for a lost item is obviously frustrating. Meanwhile, someone has found that exact item but has no idea how to contact the owner.

Right now, lost item info is usually reported through WhatsApp group chats. However, the problem is, that approach is not reliable if the owner is not in the group, or when the message gets buried in a lot of chats. _"The owner is searching. The finder wants to help. Yet, they never find each other."_

This Lost & Found website is built to solve that problem: bringing students who lost an item together with students who found it, in a single web application.

## Team Responsibilities
| Role | Name | Responsibilities |
|---|---|---|
| Backend | Forza Derian |  |
| Frontend | Mirza Attar Fauzie |  |
| Frontend | Lusiana Cendra Sari |  |

## 2. Page List

Following the route list in `README.md`:

| Page | Route | Description |
|---|---|---|
| Report List | `/` | Shows all Lost & Found reports publicly. |
| Submit Report | `/report` | Form for submitting an item report. |
| Report Detail | `/reports/:id` | Detail page for each report. |
| Account | `/account` | Logged-in user data and their preferred contact method. |


## 3. Feature List

### Required features

1. **Public Report Listing & Details**: Shows all Lost and Found reports publicly, with a dedicated detail page for each report.
2. **Report Submission**: Provides a form to submit Lost or Found reports, including an optional photo upload.

### Optional feature

1. **Search & Filtering**: Users can search reports by item name and filter by report type (Lost/Found), category, and location.
