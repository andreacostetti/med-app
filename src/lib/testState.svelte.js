export let activeTest = $state({
    id: null,
    questions: [],
    totalQuestions: 0,
    
    // Un metodo comodo per azzerare lo stato
    reset() {
        this.id = null;
        this.questions = [];
        this.currentIndex = 0;
    }
});