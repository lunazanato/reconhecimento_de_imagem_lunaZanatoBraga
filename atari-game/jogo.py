import sys
import random
# pyrefly: ignore [missing-import]
import pygame

WIDTH, HEIGHT = 600, 800
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREEN = (0, 200, 0)
RED = (200, 0, 0)


class Player:
	def __init__(self):
		self.width = 50
		self.height = 20
		self.x = WIDTH // 2 - self.width // 2
		self.y = HEIGHT - self.height - 30
		self.speed = 6
		self.color = GREEN
		self.lives = 3

	def move(self, dx):
		self.x += dx * self.speed
		self.x = max(0, min(WIDTH - self.width, self.x))

	def draw(self, surf):
		pygame.draw.rect(surf, self.color, (self.x, self.y, self.width, self.height))


class Bullet:
	def __init__(self, x, y, dy=-10, color=WHITE):
		self.x = x
		self.y = y
		self.radius = 4
		self.dy = dy
		self.color = color

	def update(self):
		self.y += self.dy

	def draw(self, surf):
		pygame.draw.circle(surf, self.color, (int(self.x), int(self.y)), self.radius)


class Enemy:
	def __init__(self, x, y, w=40, h=20):
		self.x = x
		self.y = y
		self.w = w
		self.h = h
		self.speed = 1
		self.direction = 1
		self.color = RED

	def update(self):
		self.x += self.speed * self.direction

	def shift_down(self):
		self.y += self.h + 8
		self.direction *= -1

	def draw(self, surf):
		pygame.draw.rect(surf, self.color, (self.x, self.y, self.w, self.h))


def main():
	pygame.init()
	screen = pygame.display.set_mode((WIDTH, HEIGHT))
	pygame.display.set_caption('Atari-style: Space Raid')
	clock = pygame.time.Clock()
	font = pygame.font.SysFont(None, 28)

	player = Player()
	bullets = []
	enemies = []
	score = 0

	# create enemy grid
	cols = 8
	rows = 4
	padding_x = 15
	padding_y = 20
	start_x = 60
	start_y = 60
	for row in range(rows):
		for col in range(cols):
			x = start_x + col * (40 + padding_x)
			y = start_y + row * (20 + padding_y)
			enemies.append(Enemy(x, y))

	enemy_move_timer = 0
	enemy_move_delay = 30  # frames between horizontal moves

	running = True
	game_over = False

	while running:
		dt = clock.tick(FPS)
		for event in pygame.event.get():
			if event.type == pygame.QUIT:
				running = False
			elif event.type == pygame.KEYDOWN and not game_over:
				if event.key == pygame.K_SPACE:
					# shoot
					bx = player.x + player.width // 2
					by = player.y
					bullets.append(Bullet(bx, by, dy=-8))
				if event.key == pygame.K_ESCAPE:
					running = False
			elif event.type == pygame.KEYDOWN and game_over:
				if event.key == pygame.K_r:
					return main()

		keys = pygame.key.get_pressed()
		if not game_over:
			dx = 0
			if keys[pygame.K_LEFT] or keys[pygame.K_a]:
				dx = -1
			if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
				dx = 1
			player.move(dx)

		# update bullets
		for b in bullets[:]:
			b.update()
			if b.y < -10 or b.y > HEIGHT + 10:
				bullets.remove(b)

		# update enemies movement rhythm
		enemy_move_timer += 1
		if enemy_move_timer >= enemy_move_delay:
			enemy_move_timer = 0
			# determine if any enemy will hit edges
			hit_left = any(e.x <= 0 for e in enemies)
			hit_right = any(e.x + e.w >= WIDTH for e in enemies)
			if hit_left or hit_right:
				# shift down and reverse
				for e in enemies:
					e.shift_down()
			else:
				for e in enemies:
					e.update()

		# collisions
		for b in bullets[:]:
			for e in enemies[:]:
				if (e.x < b.x < e.x + e.w) and (e.y < b.y < e.y + e.h):
					try:
						enemies.remove(e)
						bullets.remove(b)
					except ValueError:
						pass
					score += 10
					break

		# enemies reach player
		for e in enemies:
			if e.y + e.h >= player.y:
				game_over = True

		if not enemies:
			game_over = True

		# draw
		screen.fill(BLACK)
		player.draw(screen)
		for b in bullets:
			b.draw(screen)
		for e in enemies:
			e.draw(screen)

		# HUD
		score_surf = font.render(f'Score: {score}', True, WHITE)
		screen.blit(score_surf, (10, 10))

		if game_over:
			over_surf = font.render('GAME OVER - Press R to restart', True, WHITE)
			rect = over_surf.get_rect(center=(WIDTH // 2, HEIGHT // 2))
			screen.blit(over_surf, rect)

		pygame.display.flip()

	pygame.quit()
	sys.exit()


if __name__ == '__main__':
	main()

