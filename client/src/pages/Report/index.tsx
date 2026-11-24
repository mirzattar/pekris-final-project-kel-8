import { useState } from "react"
import StyledButton from "../../components/StyledButton"
import Styles from "./index.module.css"

export default function Report() {
	const [ category, setCategory ] = useState("")

	return (
		<div className={ Styles.page }>
			<h1 className={ Styles.heading }>Report an item</h1>
			<form
				action="/dummy-report-submission"
				method="post"
				encType="multipart/form-data"
				className={ Styles.form }
			>
				<div className={ Styles.fields }>
					<label className={ Styles.field } htmlFor="report-title">
						Item name
						<input className={ Styles.control } id="report-title" name="title" type="text" required />
					</label>
					<label className={ Styles.field } htmlFor="report-type">
						Report type
						<select className={ Styles.control } id="report-type" name="type" defaultValue="" required>
							<option value="" disabled>Select a type</option>
							<option value="LOST">Lost</option>
							<option value="FOUND">Found</option>
						</select>
					</label>
					<label className={ Styles.field } htmlFor="report-category">
						Category
						<input
							className={ Styles.control }
							id="report-category"
							name="category"
							type="text"
							value={ category }
							onChange={ event => setCategory(event.currentTarget.value.toUpperCase()) }
							required
						/>
					</label>
					<label className={ Styles.field } htmlFor="report-location">
						Location
						<input className={ Styles.control } id="report-location" name="location" type="text" required />
					</label>
					<label className={ `${Styles.field} ${Styles.full_width}` } htmlFor="report-description">
						Description
						<textarea className={ Styles.control } id="report-description" name="description" rows={ 5 } required />
					</label>
					<label className={ Styles.field } htmlFor="report-incident-date">
						Incident date
						<input className={ Styles.control } id="report-incident-date" name="incidentDate" type="date" required />
					</label>
					<label className={ `${Styles.field} ${Styles.full_width}` } htmlFor="report-image">
						Image
						<input
							className={ Styles.control }
							id="report-image"
							name="image"
							type="file"
							accept="image/*"
						/>
					</label>
					<label className={ Styles.field } htmlFor="report-contact-method">
						Contact method
						<select className={ Styles.control } id="report-contact-method" name="contactMethod" disabled>
							<option value="">Unavailable for now</option>
							<option value="EMAIL">Email</option>
							<option value="WHATSAPP">WhatsApp</option>
						</select>
					</label>
				</div>
				<div className={ Styles.actions }>
					<StyledButton type="submit">Submit report</StyledButton>
				</div>
			</form>
		</div>
	)
}
