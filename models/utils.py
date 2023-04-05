# Random utils for models
from difflib import SequenceMatcher
from typing import Optional, Tuple


# TODO: support multiple entities per text
def find_fuzzy_match(pattern: str, text: str) -> Optional[Tuple[int, int]]:
    """Find a fuzzy match for a pattern in a text"""
    pattern = pattern.lower()
    text = text.lower()
    m = SequenceMatcher(None, pattern, text, autojunk=False)
    blocks = m.get_matching_blocks()
    for (_, long_start, _) in blocks:
        text_substr = text[long_start : long_start + len(pattern)]
        m2 = SequenceMatcher(None, pattern, text_substr, autojunk=False)
        if m2.ratio() > 0.8:
            return (long_start, long_start + len(pattern))
    return None
