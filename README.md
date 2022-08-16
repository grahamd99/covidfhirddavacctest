# covidfhirddavacctest
Send request to https://digital.nhs.uk/developer/api-catalogue/immunisation-history-fhir , parse and render response as HTML

Example .env file values:
Bearer=<a bearer token value>
NHSNumber=<an NHS Number value, e.g. 9000000009, which is a test NHS Number>
Base_Url=https://sandbox.api.service.nhs.uk/immunisation-history
Target=COVID19
