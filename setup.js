function setPlayerNames(mode) {
    const player1Name = document.getElementById('player1').value;
    const player2Name = document.getElementById('player2').value;

    if (!player1Name || !player2Name) {
        alert('Please enter names for both players.');
        return;
    }

    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);
    localStorage.setItem('mode', mode);

    window.location.href = 'game.html';
}
