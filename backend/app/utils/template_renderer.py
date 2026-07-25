import datetime

def render_template(template_body: str, variables: dict) -> str:
    """
    Replaces variables in the format {{VariableName}} with actual values.
    Built-in variables like {{Today}} are automatically handled if not provided.
    """
    if "{{Today}}" in template_body and "Today" not in variables:
        variables["Today"] = datetime.date.today().strftime("%B %d, %Y")
        
    result = template_body
    for key, value in variables.items():
        placeholder = f"{{{{{key}}}}}"
        result = result.replace(placeholder, str(value) if value else "")
        
    return result
