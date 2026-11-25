
import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import StyledButton from "../../components/StyledButton"
import { createReport, type CreateReportPayload } from "../../services/reportApi"
import Styles from "./index.module.css"

const DEFAULT_CONTACT_METHOD: CreateReportPayload["contactMethod"] = "EMAIL"

export default function Report() {
    const [category, setCategory] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (isSubmitting) return

        const formData = new FormData(event.currentTarget)
        const type = formData.get("type")

        if (type !== "LOST" && type !== "FOUND") {
            setSubmitError("Choose whether the item was lost or found.")
            return
        }

        const getText = (field: string) => {
            const value = formData.get(field)
            return typeof value === "string" ? value.trim() : ""
        }

        const payload: CreateReportPayload = {
            title: getText("title"),
            description: getText("description"),
            type,
            category: getText("category").toUpperCase(),
            location: getText("location"),
            incidentDate: getText("incidentDate"),
            contactMethod: DEFAULT_CONTACT_METHOD
        }

        setIsSubmitting(true)
        setSubmitError("")

        try {
            const report = await createReport(payload)
            navigate(`/reports/${report.id}`)
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Unable to submit the report."
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={Styles.page}>
            <h1 className={Styles.heading}>Report an item</h1>

            <form
                className={Styles.form}
                onSubmit={handleSubmit}
                aria-busy={isSubmitting}
            >
                <div className={Styles.fields}>
                    <label className={Styles.field} htmlFor="report-title">
                        Item name
                        <input
                            className={Styles.control}
                            id="report-title"
                            name="title"
                            type="text"
                            required
                        />
                    </label>

                    <label className={Styles.field} htmlFor="report-type">
                        Report type
                        <select
                            className={Styles.control}
                            id="report-type"
                            name="type"
                            defaultValue=""
                            required
                        >
                            <option value="" disabled>Select a type</option>
                            <option value="LOST">Lost</option>
                            <option value="FOUND">Found</option>
                        </select>
                    </label>

                    <label className={Styles.field} htmlFor="report-category">
                        Category
                        <input
                            className={Styles.control}
                            id="report-category"
                            name="category"
                            type="text"
                            value={category}
                            onChange={event =>
                                setCategory(event.currentTarget.value.toUpperCase())
                            }
                            required
                        />
                    </label>

                    <label className={Styles.field} htmlFor="report-location">
                        Location
                        <input
                            className={Styles.control}
                            id="report-location"
                            name="location"
                            type="text"
                            required
                        />
                    </label>

                    <label
                        className={`${Styles.field} ${Styles.full_width}`}
                        htmlFor="report-description"
                    >
                        Description
                        <textarea
                            className={Styles.control}
                            id="report-description"
                            name="description"
                            rows={5}
                            required
                        />
                    </label>

                    <label className={Styles.field} htmlFor="report-incident-date">
                        Incident date
                        <input
                            className={Styles.control}
                            id="report-incident-date"
                            name="incidentDate"
                            type="date"
                            required
                        />
                    </label>

                    <label
                        className={`${Styles.field} ${Styles.full_width}`}
                        htmlFor="report-image"
                    >
                        Image
                        <input
                            className={Styles.control}
                            id="report-image"
                            name="image"
                            type="file"
                            accept="image/*"
                            disabled
                        />
                        <span className={Styles.field_help}>
                            Image uploads are not supported by the API yet.
                        </span>
                    </label>

                    <label className={Styles.field} htmlFor="report-contact-method">
                        Contact method
                        <select
                            className={Styles.control}
                            id="report-contact-method"
                            name="contactMethod"
                            defaultValue={DEFAULT_CONTACT_METHOD}
                        >
                            <option value="EMAIL">Email</option>
                            <option value="WHATSAPP">WhatsApp</option>
                        </select>
                    </label>
                </div>

                {submitError && (
                    <p className={Styles.error} role="alert">
                        {submitError}
                    </p>
                )}

                <div className={Styles.actions}>
                    <StyledButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit report"}
                    </StyledButton>
                </div>
            </form>
        </div>
    )
}
