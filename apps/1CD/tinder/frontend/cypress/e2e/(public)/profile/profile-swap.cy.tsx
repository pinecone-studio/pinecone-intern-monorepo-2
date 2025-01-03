describe('Профайл хуудас', () => {
  beforeEach(() => {
    cy.visit('/profile'); // Үнэн бодит URL эсвэл таны профайл хуудас руу зааж өгнө үү
  });

  it('Профайл мэдээллийг анхдагч байдлаар харах ёстой', () => {
    cy.contains('Hi, Shagai').should('be.visible');
    cy.contains('n.shagai@pinecone.mn').should('be.visible');
    cy.get('p.text-lg.font-medium.text-zinc-950').contains('Personal Information');
  });

  it('Профайл болон Зураг табуудыг зөв өөрчлөх ёстой', () => {
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Profile').should('have.class', 'bg-zinc-100');
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Images').click();
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Images').should('have.class', 'bg-zinc-100');
    cy.get('[data-cy=Tab-Navigation-Profile]').click();
    cy.get("[data-cy=Tab-Navigation]").should("be.visible");
  });

  it('Анхдагч байдлаар "Profile" табын агуулгыг харуулах ёстой', () => {
    cy.contains('Personal Information');
    cy.get('input[placeholder="Elon"]').should('exist');
    cy.get('input[placeholder="Musk"]').should('exist');
  });

  it('Зураг табын агуулгыг дарсны дараа харуулах ёстой', () => {
    cy.get('.rounded-md.text-sm.text-zinc-950').contains('Images').click();
    cy.get('.w-full.h-full.bg-red-200').should('exist');
    cy.get('p').contains('Odoogoor zurag baihgui baina !').should('exist');
  });

  it('Профайлыг "Update profile" товчийг дарж шинэчлэх ёстой', () => {
    cy.get('input[placeholder="Elon"]').clear().type('Elon Musk');
    cy.get('input[placeholder="Musk"]').clear().type('elon.musk@example.com');
    cy.get('textarea[placeholder="Adventurous spirit..."]').clear().type('New bio content: Passionate about technology and innovation!');
    cy.get('.w-32.h-9.bg-rose-600').click();
  });

  it('Зөв сонирхлын жагсаалтыг харуулах ёстой', () => {
    const interests = ['Art', 'Music', 'Investment', 'Technology', 'Design', 'Education', 'Health', 'Fashion', 'Travel', 'Food'];
    cy.get('.border.border-zinc-400.py-2.px-3.grid.grid-cols-9.gap-1.rounded-md')
      .children()
      .each((chip, index) => {
        cy.wrap(chip).contains(interests[index]);
      });
  });

  it('Зөв хугацааны сонголт үзүүлж буй огнооны талбар харагдах ёстой', () => {
    cy.get('input[placeholder="21 Aug 1990"]').should('exist');
    cy.get('.text-zinc-500.cursor-pointer').click();
  });

  it('Хүйсийн талбар руу бичих боломжтой байх ёстой', () => {
    cy.get('input[placeholder="Enter gender (e.g., Male, Female, Custom)"]').should('exist');
    cy.get('input[placeholder="Enter gender (e.g., Male, Female, Custom)"]').clear().type('Male');
    cy.get('input[placeholder="Enter gender (e.g., Male, Female, Custom)"]').should('have.value', 'Male');
  });
});
