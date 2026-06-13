const user = $state({
    preferences: {
        fav_subjects: ["biology", "physics", "chemistry", "maths"]
    },
    premium: false,
    isLoggedIn: false
});

export { user };