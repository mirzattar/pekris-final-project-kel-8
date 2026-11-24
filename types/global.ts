export type ReportId = `report-${number}`
export type Assertion<T> = (val: unknown) => asserts val is T
