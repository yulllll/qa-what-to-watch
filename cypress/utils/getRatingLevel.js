export const getRatingLevel = (rating) => {
    switch (true) {
        case rating < 3:
            return 'Bad';
        case rating < 5:
            return 'Normal';
        case rating < 8:
            return 'Good';
        case rating < 10:
            return 'Very good';
        default:
            return 'Awesome';
    }

}