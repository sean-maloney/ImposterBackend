class Collection:
    _name = "base"


class WordsCollection(Collection):
    _name = "words"

    def __init__(self, category: str, word: str, hint: str) -> None:
        self.category = category
        self.word = word
        self.hint = hint


class UsersCollection(Collection):
    _name = "users"

    def __init__(self, name: str, email: str, password_hash: str) -> None:
        self.name = name
        self.email = email
        self.password_hash = password_hash
