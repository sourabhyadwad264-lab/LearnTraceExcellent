export const seedWorkspace = {
  bookmarks: [
    {
      id: 'b-1',
      title: 'Dependency Injection: constructor vs field injection',
      course: 'Spring Boot',
      timestamp: '00:42:18',
      source: 'Live class · Session 12',
      note: 'Revisit why constructor injection makes dependencies explicit and easier to test.',
      status: 'review',
      createdAt: '2026-10-29T10:20:00.000Z'
    },
    {
      id: 'b-2',
      title: 'React useEffect cleanup',
      course: 'React',
      timestamp: '01:16:40',
      source: 'React workshop · Part 3',
      note: 'Understand when the cleanup function runs and how it prevents stale subscriptions.',
      status: 'understood',
      createdAt: '2026-10-28T08:00:00.000Z'
    },
    {
      id: 'b-3',
      title: 'JPA repository query methods',
      course: 'Spring Data JPA',
      timestamp: '00:28:05',
      source: 'Mentor demo · Repository methods',
      note: 'Practise findByNameContainingIgnoreCase and sorting by price.',
      status: 'review',
      createdAt: '2026-10-27T08:00:00.000Z'
    }
  ],
  snippets: [
    {
      id: 's-1',
      title: 'Find products by partial name',
      language: 'Java',
      code: '@Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT(\'%\', :name, \'%\'))")\nList<Product> searchByName(@Param("name") String name);',
      explanation: 'A case-insensitive JPQL search for a partial product name.',
      tags: ['Spring Data JPA', 'Query'],
      createdAt: '2026-10-29T09:00:00.000Z'
    },
    {
      id: 's-2',
      title: 'Safe array mapping in React',
      language: 'JavaScript',
      code: 'const visibleItems = items.filter((item) =>\n  item.title.toLowerCase().includes(search.toLowerCase())\n);',
      explanation: 'Keep filtering derived from state instead of mutating the original array.',
      tags: ['React', 'Arrays'],
      createdAt: '2026-10-28T09:00:00.000Z'
    }
  ],
  notes: [
    {
      id: 'n-1',
      title: 'REST API checklist',
      body: 'Use the correct HTTP method. Return meaningful status codes. Validate request bodies. Keep controller, service, and repository responsibilities separate. Test error paths as well as happy paths.',
      course: 'Backend development',
      pinned: true,
      createdAt: '2026-10-29T07:00:00.000Z'
    },
    {
      id: 'n-2',
      title: 'Questions for next mentoring session',
      body: 'When should I use DTOs? How do transactions affect service methods? What belongs in a global exception handler?',
      course: 'Spring Boot',
      pinned: false,
      createdAt: '2026-10-28T07:00:00.000Z'
    }
  ],
  goals: [
    { id: 'g-1', title: 'Revise React hooks', target: '3 focused sessions', done: 2 },
    { id: 'g-2', title: 'Practise Spring Boot APIs', target: 'Build one endpoint end-to-end', done: 1 },
    { id: 'g-3', title: 'Review SQL joins', target: 'Solve 5 practice queries', done: 3 }
  ]
};
