import re, json
from pydantic import ValidationError

from exports.types import MemoryExtractionOutput

def parse_extracted_response(llm_response: str) -> MemoryExtractionOutput:
    json_response = None
    markdown_match = re.search(
            r"```json\s*(\{.*?\})\s*```",
            llm_response,
            re.DOTALL
            )
    if markdown_match:
        json_response = markdown_match.group(1)
    else:
        raw_match = re.search(
                r"(\{.*\})",
                llm_response,
                re.DOTALL
                )
        if raw_match:
            json_response = raw_match.group(1)
    if not json_response:
        raise ValueError("No json object found in llm response")
    try:
        parsed = json.loads(json_response)
        return MemoryExtractionOutput.model_validate(parsed)
    except ValidationError as e:
        raise ValueError(f"Json does not match the MemoryExtractionOutput schema: {str(e)}")
