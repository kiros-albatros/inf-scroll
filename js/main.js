// Параметр threshold со значением 1.0 означает что функция будет вызвана
// при 100% пересечении объекта (за которым мы следим) с объектом root

window.onload = () => {
  let nextPage = 2;
  const scrollArea = document.querySelector('#scrollArea');

  let infiniteObserver;
  infiniteObserver = new IntersectionObserver(
    ([entry], observer) => {
      // проверяем что достигли последнего элемента
      if (entry.isIntersecting) {
        // перестаем его отслеживать
        observer.unobserve(entry.target);
        // и загружаем новую порцию контента
        loadNewCards(nextPage++);
      }
    },
    {threshold: 0.5}
  );

  const loadNewCards = (page = 1) => {
    // запрашиваем посты по конкретной странице
    fetch(`https://jsonplaceholder.typicode.com/albums/1/photos?_limit=5&_page=${page}`)
      .then((res) => res.json())
      .then((cards) => {
        // для каждого поста создаем разметку
        cards.forEach((card) => {
          const post = document.createElement("div");
          post.innerHTML = `
          <h3>${card.id} ${card.title}</h3>
          <img src=${card.thumbnailUrl}/>
        `;
          post.className = "card";
          scrollArea.append(post);
        });

        // для последней карточки снова добавляем обзёрвер
        const lastCard = document.querySelector(".card:last-child");
        if (lastCard) {
          infiniteObserver.observe(lastCard);
        }
      })
      .catch(console.error);
  };

// делаем стартовую инициализацию
  loadNewCards();

}
