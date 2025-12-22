import re, json
from pydantic import ValidationError
from exports.types import MemoryExtractionOutput
from typing import Dict, List, Union, Any

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

def normalize_llm_response(
    response: Union[str, List[Union[str, Dict[str, Any]]]]
) -> str:
    if isinstance(response, str):
        return response

    if isinstance(response, list):
        parts = []
        for item in response:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                content = item.get("content")
                if isinstance(content, str):
                    parts.append(content)
        return "\n".join(parts)
