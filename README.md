# pekris-final-project-kel-8

## Anggota

PIC: Fossy

| Role | Nama | NPM |
| --- | --- | --- |
| Backend | Forza Derian | 2506596041 |
| Frontend | Mirza Attar Fauzie | 2606748616 |
| Frontend | Lusiana Cendra Sari | 2606806553 |

## Deskripsi

Website Lost & Found: Mempertemukan mahasiswa yang kehilangan barangnya dengan orang yang menemukannya. Final Project RISTEK Open Class Web Development 2026.

## Checkpoint 1

### Define application pages, features, and team responsibilities

Routes:

1. Root page (`/`). A list or display of recent public reports, CTA, and short service description.
2. Report submission page (`/report`). A form for submitting item reports.
3. Account page (`/account`). An account page showing the logged-in user's data and preferred contact methods.

Features:

1. Lightweight responsive interface
2. Spam-protected contact information
3. Comprehensive report fields (image upload, location of missing item, finder details, item description, protected contact info)

Task division:

1. Mirza Attar Fauzie: Routing design, interactive feature implementation, frontend-backend contract implementation, spam-protection
2. Forza Derian: Backend implementation
3. Lusiana Cendra Sari: Mock data preparation.

### Define search/filter query parameters and pagination behavior

Search filters include:

1. `title`
2. `description`
3. `category`
4. `incidentDate`
5. `location`
6. `status`

Pagination starts with the most recently-reported items at the beginning, continuing to older entries.

### Specify the report submission format, including how optional image uploads will be handled

The report submission format provides several fields:

1. Title of the reported item.
2. Description of the reported item.
3. Category of the reported item.
4. Location where the reported item was found/last seen.
5. Date that the item was lost/last seen, defaults to the day the report was made.
6. The preferred contact method
7. An optional image upload of the reported item.

The image upload field is entirely optional, and can be emptied if so desired. A placeholder image of the item category will be used instead.
