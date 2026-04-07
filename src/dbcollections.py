class Collection:
    _name = "base"


class WordsCollection(Collection):
    _name = "words"

    def __init__(self, category: str, word: str, hint: str) -> None:
        self.category = category
        self.word = word
        self.hint = hint
