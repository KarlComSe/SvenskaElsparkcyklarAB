import { isGuarded } from './utils';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';

describe('Utils', () => {
  describe('isGuarded', () => {
    it('should detect if a route is protected by JwtAuthGuard', () => {
      @UseGuards(JwtAuthGuard)
      @Controller('test')
      class TestController {}

      expect(() => {
        isGuarded(TestController, JwtAuthGuard);
      }).not.toThrow();
    });

    it('should throw error if no guard is present', () => {
      @Controller('test')
      class TestController {}

      expect(() => {
        isGuarded(TestController, JwtAuthGuard);
      }).toThrow('No guard');
    });

    it('should throw error if wrong guard is present', () => {
      class OtherGuard {
        canActivate() {
          return true;
        }
      }

      @UseGuards(OtherGuard)
      @Controller('test')
      class TestController {}

      expect(() => {
        isGuarded(TestController, JwtAuthGuard);
      }).toThrow('to be protected with JwtAuthGuard');
    });
  });
});
